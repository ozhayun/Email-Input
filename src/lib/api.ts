const INVITE_DELAY_MS = 1500;

/**
 * Dummy invite API: logs emails to console and simulates network delay.
 * Use for development / task: "On submit log to console or run dummy API call with the list of emails".
 */
export async function submitInviteEmails(emails: string[]): Promise<void> {
  console.log("[Invite] Submitting emails:", emails);

  // Simulate API call delay (1–2 secs)
  await new Promise((resolve) => setTimeout(resolve, INVITE_DELAY_MS));

  console.log("[Invite] Done (dummy). Emails would be sent to:", emails);
}
