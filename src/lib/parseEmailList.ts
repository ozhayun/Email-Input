/**
 * Parses pasted text into an array of email strings.
 * Splits by ", " (comma space), comma, newline, semicolon, and whitespace.
 */
export function parseEmailListFromPastedText(text: string): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/[,\s;]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
