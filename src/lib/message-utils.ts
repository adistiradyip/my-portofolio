export type ParsedContactMessage = {
  subject: string | null;
  phone: string | null;
  body: string;
};

export function parseContactMessage(raw: string): ParsedContactMessage {
  const subjectMatch = raw.match(/^(?:Subject|Subjek):\s*(.+)$/im);
  const phoneMatch = raw.match(/^(?:Phone|Telepon):\s*(.+)$/im);

  const body = raw
    .replace(/^(?:Subject|Subjek):\s*.+\n?/im, "")
    .replace(/^(?:Phone|Telepon):\s*.+\n?/im, "")
    .trim();

  return {
    subject: subjectMatch?.[1]?.trim() ?? null,
    phone: phoneMatch?.[1]?.trim() ?? null,
    body: body || raw,
  };
}
