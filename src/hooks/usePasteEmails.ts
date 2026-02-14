import { useCallback, type RefObject } from "react";
import type { InviteUsersInputHandle } from "@/components/Email";
import { showBulkResultToast } from "@/lib/formatPasteEmailsResult";

export function usePasteEmails(
  inviteInputRef: RefObject<InviteUsersInputHandle | null>,
  emails: string[],
) {
  const handlePasteEmails = useCallback(() => {
    const result = inviteInputRef.current?.addEmailsBulk(emails);
    if (!result) return;
    showBulkResultToast(result);
  }, [inviteInputRef, emails]);

  return handlePasteEmails;
}
