// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { isRateLimited, processConsultation, validate } from "./consultation";

const NOW = 1_800_000_000_000;
const ENV = {
  RESEND_API_KEY: "re_test",
  CONSULTATION_TO_EMAIL: "agency@example.com",
  CONSULTATION_FROM_EMAIL: "HD NEXORA WEBTEC <hello@example.com>",
};

const valid = {
  name: "Priya",
  businessName: "Kovai Interiors",
  email: "Priya@Example.com",
  phone: "+91 99437 11466",
  service: "Local SEO",
  budget: "₹15,000 – ₹25,000 / month",
  message: "Need more local enquiries.",
  website: "",
  startedAt: NOW - 20_000,
};

let ipCounter = 0;
const run = (body: unknown, overrides: Partial<{ env: typeof ENV; fetchImpl: ReturnType<typeof vi.fn> }> = {}) => {
  const fetchImpl = overrides.fetchImpl ?? vi.fn().mockResolvedValue({ ok: true, status: 200 });
  const promise = processConsultation(body, {
    ip: `10.0.0.${++ipCounter}`,
    env: overrides.env ?? ENV,
    now: NOW,
    fetchImpl,
  });
  return { promise, fetchImpl };
};

const sentPayloads = (fetchImpl: ReturnType<typeof vi.fn>) =>
  fetchImpl.mock.calls.map(([, init]) => JSON.parse((init as RequestInit).body as string));

describe("processConsultation", () => {
  it("sends the agency notification and the customer confirmation", async () => {
    const { promise, fetchImpl } = run(valid);
    const result = await promise;

    expect(result.status).toBe(200);
    expect(result.body.reference).toMatch(/^HDN-/);
    const [agency, customer] = sentPayloads(fetchImpl);
    expect(agency.to).toEqual(["agency@example.com"]);
    expect(agency.reply_to).toBe("priya@example.com");
    expect(agency.text).toContain("Kovai Interiors");
    expect(customer.to).toEqual(["priya@example.com"]);
  });

  it("rejects an invalid email with a field error", async () => {
    const result = await run({ ...valid, email: "not-an-email" }).promise;
    expect(result.status).toBe(400);
    expect(result.body.errors).toHaveProperty("email");
  });

  it("rejects missing required fields", async () => {
    const result = await run({ ...valid, name: "", service: "" }).promise;
    expect(result.status).toBe(400);
    expect(Object.keys(result.body.errors as object)).toEqual(expect.arrayContaining(["name", "service"]));
  });

  it("rejects options that are not on the form", async () => {
    const result = await run({ ...valid, budget: "$1,000,000" }).promise;
    expect(result.status).toBe(400);
    expect(result.body.errors).toHaveProperty("budget");
  });

  it("silently drops submissions that fill the hidden field", async () => {
    const { promise, fetchImpl } = run({ ...valid, website: "http://spam.example" });
    expect((await promise).status).toBe(200);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("silently drops submissions sent too quickly", async () => {
    const { promise, fetchImpl } = run({ ...valid, startedAt: NOW - 500 });
    expect((await promise).status).toBe(200);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not report success when email is not configured", async () => {
    const { promise, fetchImpl } = run(valid, { env: { ...ENV, RESEND_API_KEY: "" } });
    expect((await promise).status).toBe(503);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not report success when the agency email fails", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 422 });
    expect((await run(valid, { fetchImpl }).promise).status).toBe(502);
  });

  it("still succeeds when only the customer confirmation fails", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce({ ok: false, status: 403 });
    expect((await run(valid, { fetchImpl }).promise).status).toBe(200);
  });

  it("escapes HTML in the agency email", async () => {
    const { promise, fetchImpl } = run({ ...valid, message: "<script>alert(1)</script>" });
    await promise;
    const [agency] = sentPayloads(fetchImpl);
    expect(agency.html).not.toContain("<script>");
    expect(agency.html).toContain("&lt;script&gt;");
  });
});

describe("validate", () => {
  it("keeps non-English names and the + in phone numbers", () => {
    const { enquiry } = validate({ ...valid, name: "செல்வி", phone: "+91 88383 58916" });
    expect(enquiry?.name).toBe("செல்வி");
    expect(enquiry?.phone).toBe("+91 88383 58916");
  });

  it("trims and limits long input", () => {
    const { enquiry } = validate({ ...valid, message: `  ${"a".repeat(5000)}  ` });
    expect(enquiry?.message).toHaveLength(2000);
  });
});

describe("isRateLimited", () => {
  it("blocks the sixth request from one address within an hour", () => {
    const store = new Map<string, number[]>();
    const results = Array.from({ length: 6 }, (_, i) => isRateLimited("1.2.3.4", NOW + i, store));
    expect(results).toEqual([false, false, false, false, false, true]);
    expect(isRateLimited("1.2.3.4", NOW + 61 * 60 * 1000, store)).toBe(false);
  });
});

describe("control characters", () => {
  it("removes control characters but keeps line breaks", () => {
    const { enquiry } = validate({ ...valid, message: "Line one\u0007\nLine two\u0000" });
    expect(enquiry?.message).toBe("Line one\nLine two");
  });
});
