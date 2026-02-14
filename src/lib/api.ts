const INVITE_DELAY_MS = 2000;

/**
 * Dummy invite API: simulates network delay, then logs the final list of emails.
 * Requirement: "On submit log to console or run dummy API call with the list of emails".
 * Final list is logged only after the delay.
 */
export async function submitInviteEmails(emails: string[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, INVITE_DELAY_MS));
  console.log("[Invite] Final list of emails (after delay):", emails);
}
