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
  const startedAt = Number(data.startedAt);
  if (clean(data.website, 200) || !startedAt || now - startedAt < MIN_FILL_MS) {
    return { status: 200, body: { message: "Thank you. Your request has been received." } };
  }

  if (isRateLimited(ip, now)) {
    return { status: 429, body: { message: "Too many requests. Please try again later or contact us on WhatsApp." } };
  }

  const { enquiry, errors } = validate(data);
  if (!enquiry) {
    return { status: 400, body: { message: "Please check the highlighted fields.", errors } };
  }

  const { RESEND_API_KEY, CONSULTATION_TO_EMAIL, CONSULTATION_FROM_EMAIL, CONSULTATION_BACKUP_EMAIL } = env;
  if (!RESEND_API_KEY || !CONSULTATION_TO_EMAIL || !CONSULTATION_FROM_EMAIL) {
    console.error("consultation: email service is not configured");
    return {
      status: 503,
      body: { message: "Online requests are temporarily unavailable. Please contact us on WhatsApp." },
    };
  }

  const reference = `HDN-${now.toString(36).toUpperCase()}`;

  try {
    const agency = await sendEmail(fetchImpl, RESEND_API_KEY, {
      from: CONSULTATION_FROM_EMAIL,
      to: [CONSULTATION_TO_EMAIL],
      ...(CONSULTATION_BACKUP_EMAIL ? { bcc: [CONSULTATION_BACKUP_EMAIL] } : {}),
      reply_to: enquiry.email,
      ...agencyEmail(enquiry, reference),
    });
    if (!agency.ok) {
      console.error(`consultation: agency email failed with status ${agency.status} (${reference})`);
      return {
        status: 502,
        body: { message: "We couldn't send your request right now. Please try again or contact us on WhatsApp." },
      };
    }
  } catch {
    console.error(`consultation: agency email request errored (${reference})`);
    return {
      status: 502,
      body: { message: "We couldn't send your request right now. Please try again or contact us on WhatsApp." },
    };
  }

  // The enquiry has reached the agency, so a failed acknowledgement must not fail the request.
  try {
    const ack = await sendEmail(fetchImpl, RESEND_API_KEY, {
      from: CONSULTATION_FROM_EMAIL,
      to: [enquiry.email],
      reply_to: CONSULTATION_TO_EMAIL,
      ...customerEmail(enquiry, reference),
    });
    if (!ack.ok) console.error(`consultation: confirmation email failed with status ${ack.status} (${reference})`);
  } catch {
    console.error(`consultation: confirmation email request errored (${reference})`);
  }

  return { status: 200, body: { message: "Thank you. Your request has been received.", reference } };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
