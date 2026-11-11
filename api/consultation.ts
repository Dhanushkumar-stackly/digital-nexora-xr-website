import type { VercelRequest, VercelResponse } from "@vercel/node";

// In-memory rate limiting (for serverless, consider Redis for production)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_REQUESTS = 3;
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recentRequests = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_REQUESTS) {
    return true;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return false;
}

function sanitizeInput(input: string, maxLength: number = 500): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[^a-zA-Z0-9\s\-.,'@()&]/g, ""); // Remove suspicious characters
}

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 255;
}

function validatePhone(phone: string): boolean {
  const regex = /^[\d\s\-+()]{7,20}$/;
  return regex.test(phone);
}

async function sendEmails(
  formData: {
    name: string;
    businessName: string;
    email: string;
    phone: string;
    service: string;
    budget: string;
    message: string;
  }
): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured, skipping email notifications");
    return;
  }

  const agencyEmail = process.env.AGENCY_EMAIL || "contact@hdnexorawebtec.com";

  try {
    // Send email to agency
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@hdnexorawebtec.com",
        to: agencyEmail,
        subject: `New Consultation Request from ${formData.name}`,
        html: `
          <h2>New Consultation Request</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Business:</strong> ${formData.businessName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Service Interested:</strong> ${formData.service}</p>
          <p><strong>Budget:</strong> ${formData.budget}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message || "No message provided"}</p>
        `,
      }),
    });

    // Send confirmation email to customer
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@hdnexorawebtec.com",
        to: formData.email,
        subject: "We've Received Your Consultation Request",
        html: `
          <h2>Thank You, ${formData.name}!</h2>
          <p>We've received your consultation request and will review the details shortly.</p>
          <p>Our team will contact you within 24-48 hours at the phone number or email you provided.</p>
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>We'll review your project details</li>
            <li>Our team will reach out to discuss your needs</li>
            <li>We'll provide a customized proposal</li>
          </ul>
          <p>If you have any questions in the meantime, feel free to reply to this email.</p>
          <p>Best regards,<br />HD NEXORA WEBTEC Team</p>
        `,
      }),
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    throw new Error("Failed to send confirmation emails");
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Rate limiting
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  if (isRateLimited(clientIp)) {
    res.status(429).json({ message: "Too many requests. Please try again later." });
    return;
  }

  const { name, businessName, email, phone, service, budget, message } = req.body;

  // Validation
  if (!name || !businessName || !email || !phone || !service || !budget) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).json({ message: "Invalid email address" });
    return;
  }

  if (!validatePhone(phone)) {
    res.status(400).json({ message: "Invalid phone number" });
    return;
  }

  // Sanitize inputs
  const sanitized = {
    name: sanitizeInput(name, 100),
    businessName: sanitizeInput(businessName, 100),
    email: email.toLowerCase().trim().slice(0, 255),
    phone: sanitizeInput(phone, 20),
    service: sanitizeInput(service, 50),
    budget: sanitizeInput(budget, 20),
    message: sanitizeInput(message || "", 1000),
  };

  try {
    // Send emails (Resend integration)
    await sendEmails(sanitized);

    // Log the submission (in production, store in database or logging service)
    console.log("Consultation request received:", {
      timestamp: new Date().toISOString(),
      ...sanitized,
    });

    res.status(200).json({
      message: "Consultation request received successfully",
      reference: `CONSULT-${Date.now()}`,
    });
  } catch (error) {
    console.error("Error processing consultation:", error);
    res.status(500).json({
      message: "Failed to process your request. Please try again later.",
    });
  }
}
