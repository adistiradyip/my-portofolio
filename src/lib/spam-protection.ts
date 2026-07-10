const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const MIN_SUBMIT_MS = 3000;
const MAX_MESSAGE_LENGTH = 5000;

const rateLimitMap = new Map<string, number[]>();

export type SpamCheckResult =
  | { ok: true }
  | { ok: false; code: "spam" | "rate_limit" | "validation" };

export function checkContactSpam(
  formData: FormData,
  clientIp: string,
): SpamCheckResult {
  const honeypot = (formData.get("website") as string | null)?.trim();
  if (honeypot) {
    return { ok: false, code: "spam" };
  }

  const startedAt = Number(formData.get("form_started_at"));
  if (!startedAt || Date.now() - startedAt < MIN_SUBMIT_MS) {
    return { ok: false, code: "spam" };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !message) {
    return { ok: false, code: "validation" };
  }

  if (name.length > 100 || email.length > 254 || message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, code: "validation" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, code: "validation" };
  }

  const now = Date.now();
  const recent = (rateLimitMap.get(clientIp) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    return { ok: false, code: "rate_limit" };
  }

  recent.push(now);
  rateLimitMap.set(clientIp, recent);

  return { ok: true };
}
