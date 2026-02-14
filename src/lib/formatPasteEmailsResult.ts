import { toast } from "sonner";

export interface PasteEmailsResult {
  added: number;
  invalid: number;
  skippedInInput: number;
  skippedInvited: number;
}

const plural = (n: number, word: string) =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * Formats the result of a bulk email paste into a user-facing message and toast variant.
 */
export function formatPasteEmailsResult(
  result: PasteEmailsResult,
): { message: string; variant: "success" | "info" } {
  const { added, invalid, skippedInInput, skippedInvited } = result;
  const skippedTotal = skippedInInput + skippedInvited;

  if (added > 0) {
    const parts: string[] = [];
    if (invalid > 0) parts.push(`${plural(invalid, "invalid")} skipped`);
    if (skippedInInput > 0) parts.push(`${plural(skippedInInput, "already in list")}`);
    if (skippedInvited > 0) parts.push(`${plural(skippedInvited, "already invited")}`);
    const suffix = parts.length > 0 ? `. ${parts.join(". ")}` : "";
    return {
      message: `Added ${plural(added, "email")}${suffix}`,
      variant: "success",
    };
  }

  if (skippedTotal > 0 || invalid > 0) {
    const parts: string[] = [];
    if (skippedInInput > 0)
      parts.push(
        `${plural(skippedInInput, "valid email")} already in list`,
      );
    if (skippedInvited > 0)
      parts.push(
        `${plural(skippedInvited, "valid email")} already invited`,
      );
    if (invalid > 0)
      parts.push(`${plural(invalid, "invalid email")} skipped`);
    return {
      message: parts.join(". "),
      variant: "info",
    };
  }

  return {
    message: "No valid emails to add.",
    variant: "info",
  };
}

/**
 * Formats the bulk result and shows the appropriate toast.
 */
export function showBulkResultToast(result: PasteEmailsResult): void {
  const { message, variant } = formatPasteEmailsResult(result);
  if (variant === "success") toast.success(message);
  else toast.info(message);
}
