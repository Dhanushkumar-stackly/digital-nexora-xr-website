import type { VercelRequest, VercelResponse } from "@vercel/node";

// Keep in sync with src/constants/consultation.ts.
const SERVICES = [
  "SEO",
  "Local SEO",
  "Social Media Marketing",
  "Google Ads",
  "Meta Ads",
  "Website Development",
  "Monthly Growth Package",
  "Not sure yet",
];
const BUDGETS = [
  "Under ₹15,000 / month",
  "₹15,000 – ₹25,000 / month",
  "₹25,000 – ₹50,000 / month",
  "Above ₹50,000 / month",
  "Project-based quote",
  "Not sure yet",
];

const LIMITS = { name: 100, businessName: 120, email: 254, phone: 25, message: 2000 };
const MIN_FILL_MS = 3000;
const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };

export type Enquiry = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
};

export type Env = {
  RESEND_API_KEY?: string;
  CONSULTATION_TO_EMAIL?: string;
  CONSULTATION_FROM_EMAIL?: string;
  CONSULTATION_BACKUP_EMAIL?: string;
  WHATSAPP_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_NOTIFY_TO?: string;
  WHATSAPP_TEMPLATE?: string;
  WHATSAPP_TEMPLATE_LANG?: string;
  WHATSAPP_API_VERSION?: string;
};

type Result = { status: number; body: Record<string, unknown> };

// Per-instance only: serverless instances don't share memory, so this slows bursts
// from one client rather than enforcing a global limit.
const recentByIp = new Map<string, number[]>();

export function isRateLimited(ip: string, now: number, store = recentByIp): boolean {
  const recent = (store.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    store.set(ip, recent);
    return true;
  }
  recent.push(now);
  store.set(ip, recent);
  return false;
}

const clean = (value: unknown, max: number) =>
  typeof value === "string"
    ? value
        .normalize("NFC")
        // Drop control characters except line breaks and tabs.
        .replace(/\p{Cc}/gu, (c) => ("\n\r\t".includes(c) ? c : ""))
        .trim()
        .slice(0, max)
    : "";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

export function validate(body: Record<string, unknown>): { enquiry?: Enquiry; errors: Record<string, string> } {
  const enquiry: Enquiry = {
    name: clean(body.name, LIMITS.name),
    businessName: clean(body.businessName, LIMITS.businessName),
    email: clean(body.email, LIMITS.email).toLowerCase(),
    phone: clean(body.phone, LIMITS.phone),
    service: clean(body.service, 60),
    budget: clean(body.budget, 60),
    message: clean(body.message, LIMITS.message),
  };
  const errors: Record<string, string> = {};

  if (enquiry.name.length < 2) errors.name = "Please enter your name.";
  if (enquiry.businessName.length < 2) errors.businessName = "Please enter your business name.";
  if (!EMAIL_PATTERN.test(enquiry.email)) errors.email = "Please enter a valid email address.";
  const digits = enquiry.phone.replace(/\D/g, "");
  if (!/^[+\d\s()-]+$/.test(enquiry.phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!SERVICES.includes(enquiry.service)) errors.service = "Please choose a service.";
  if (!BUDGETS.includes(enquiry.budget)) errors.budget = "Please choose a budget range.";

  return Object.keys(errors).length ? { errors } : { enquiry, errors };
}

const rows = (enquiry: Enquiry, reference: string) =>
  [
    ["Reference", reference],
    ["Name", enquiry.name],
    ["Business", enquiry.businessName],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
    ["Service", enquiry.service],
    ["Budget", enquiry.budget],
    ["Message", enquiry.message || "—"],
  ] as const;

const agencyEmail = (enquiry: Enquiry, reference: string) => ({
  subject: `New consultation request: ${enquiry.businessName} (${reference})`,
  html: `<h2>New consultation request</h2><table cellpadding="6">${rows(enquiry, reference)
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`,
  text: rows(enquiry, reference)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n"),
});

const customerEmail = (enquiry: Enquiry, reference: string) => ({
  subject: "We've received your consultation request – HD NEXORA WEBTEC",
  html: `<p>Hi ${escapeHtml(enquiry.name)},</p>
<p>Thank you for contacting HD NEXORA WEBTEC. We've received your consultation request for <strong>${escapeHtml(
    enquiry.service
  )}</strong>.</p>
<p>Our team will review your details and get in touch to discuss a suitable digital growth strategy.</p>
<p>Your reference: <strong>${reference}</strong></p>
<p>Regards,<br>HD NEXORA WEBTEC<br>Coimbatore, Tamil Nadu, India</p>`,
  text: `Hi ${enquiry.name},\n\nThank you for contacting HD NEXORA WEBTEC. We've received your consultation request for ${enquiry.service}.\n\nOur team will review your details and get in touch to discuss a suitable digital growth strategy.\n\nYour reference: ${reference}\n\nRegards,\nHD NEXORA WEBTEC\nCoimbatore, Tamil Nadu, India`,
});

type FetchLike = (url: string, init: RequestInit) => Promise<{ ok: boolean; status: number }>;

const sendEmail = (fetchImpl: FetchLike, apiKey: string, payload: Record<string, unknown>) =>
  fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export async function processConsultation(
  body: unknown,
  options: { ip: string; env: Env; now: number; fetchImpl: FetchLike }
): Promise<Result> {
  const { ip, env, now, fetchImpl } = options;

  if (!body || typeof body !== "object") {
    return { status: 400, body: { message: "Invalid request." } };
  }
  const data = body as Record<string, unknown>;

  // Bots fill the hidden field or submit instantly; answer as if it worked so they don't adapt.
  // Elapsed time is measured in the browser, so a visitor's wrong clock can't make a real enquiry look like a bot.
  const fillMs = Number(data.fillMs);
  if (clean(data.website, 200) || !Number.isFinite(fillMs) || fillMs < MIN_FILL_MS) {
    return { status: 200, body: { message: "Thank you. Your request has been received." } };
  }

  if (isRateLimited(ip, now)) {
    return { status: 429, body: { message: "Too many requests. Please try again later or contact us on WhatsApp." } };
  }

  const { enquiry, errors } = validate(data);
  if (!enquiry) {
    return { status: 400, body: { message: "Please check the highlighted fields.", errors } };
  }

  const emailReady = Boolean(env.RESEND_API_KEY && env.CONSULTATION_TO_EMAIL && env.CONSULTATION_FROM_EMAIL);
  const whatsappReady = Boolean(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_NOTIFY_TO);
  if (!emailReady && !whatsappReady) {
    console.error("consultation: no notification channel is configured");
    return {
      status: 503,
      body: { message: "Online requests are temporarily unavailable. Please contact us on WhatsApp." },
    };
  }

  const reference = `HDN-${now.toString(36).toUpperCase()}`;

  // The enquiry counts as received if at least one channel reached the agency.
  const [emailSent, whatsappSent] = await Promise.all([
    emailReady ? notifyByEmail(fetchImpl, env, enquiry, reference) : Promise.resolve(false),
    whatsappReady ? notifyByWhatsApp(fetchImpl, env, enquiry, reference) : Promise.resolve(false),
  ]);
  if (!emailSent && !whatsappSent) {
    return {
      status: 502,
      body: { message: "We couldn't send your request right now. Please try again or contact us on WhatsApp." },
    };
  }

  if (emailReady) {
    // The agency already has the enquiry, so a failed acknowledgement must not fail the request.
    try {
      const ack = await sendEmail(fetchImpl, env.RESEND_API_KEY!, {
        from: env.CONSULTATION_FROM_EMAIL,
        to: [enquiry.email],
        reply_to: env.CONSULTATION_TO_EMAIL,
        ...customerEmail(enquiry, reference),
      });
      if (!ack.ok) console.error(`consultation: confirmation email failed with status ${ack.status} (${reference})`);
    } catch {
      console.error(`consultation: confirmation email request errored (${reference})`);
    }
  }

  return { status: 200, body: { message: "Thank you. Your request has been received.", reference } };
}

async function notifyByEmail(fetchImpl: FetchLike, env: Env, enquiry: Enquiry, reference: string) {
  try {
    const res = await sendEmail(fetchImpl, env.RESEND_API_KEY!, {
      from: env.CONSULTATION_FROM_EMAIL,
      to: [env.CONSULTATION_TO_EMAIL],
      ...(env.CONSULTATION_BACKUP_EMAIL ? { bcc: [env.CONSULTATION_BACKUP_EMAIL] } : {}),
      reply_to: enquiry.email,
      ...agencyEmail(enquiry, reference),
    });
    if (!res.ok) console.error(`consultation: agency email failed with status ${res.status} (${reference})`);
    return res.ok;
  } catch {
    console.error(`consultation: agency email request errored (${reference})`);
    return false;
  }
}

// WhatsApp template parameters may not contain line breaks, tabs or long runs of spaces.
const templateText = (value: string, max = 120) => value.replace(/\s+/g, " ").trim().slice(0, max) || "-";

// Business-initiated WhatsApp messages must use a template approved in Meta; see README for its wording.
export const whatsappPayload = (env: Env, enquiry: Enquiry, reference: string) => ({
  messaging_product: "whatsapp",
  to: (env.WHATSAPP_NOTIFY_TO ?? "").replace(/\D/g, ""),
  type: "template",
  template: {
    name: env.WHATSAPP_TEMPLATE || "new_enquiry",
    language: { code: env.WHATSAPP_TEMPLATE_LANG || "en" },
    components: [
      {
        type: "body",
        parameters: [reference, enquiry.name, enquiry.businessName, enquiry.phone, enquiry.service, enquiry.budget].map(
          (value) => ({ type: "text", text: templateText(value) })
        ),
      },
    ],
  },
});

async function notifyByWhatsApp(fetchImpl: FetchLike, env: Env, enquiry: Enquiry, reference: string) {
  const version = env.WHATSAPP_API_VERSION || "v22.0";
  try {
    const res = await fetchImpl(`https://graph.facebook.com/${version}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(whatsappPayload(env, enquiry, reference)),
    });
    if (!res.ok) console.error(`consultation: WhatsApp notification failed with status ${res.status} (${reference})`);
    return res.ok;
  } catch {
    console.error(`consultation: WhatsApp notification request errored (${reference})`);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // The site is also hosted on Hostinger, which posts here cross-origin. No cookies are used.
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return;
  }
  if (!String(req.headers["content-type"] ?? "").includes("application/json")) {
    res.status(415).json({ message: "Requests must be sent as JSON." });
    return;
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || "unknown";

  const result = await processConsultation(req.body, {
    ip,
    env: process.env as Env,
    now: Date.now(),
    fetchImpl: fetch,
  });
  res.status(result.status).json(result.body);
}
