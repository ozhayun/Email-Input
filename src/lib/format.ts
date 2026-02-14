/**
 * Format ISO date (YYYY-MM-DD) to "Month Day, Year".
 * Passes through already-formatted strings unchanged.
 */
export function formatAddedOn(isoOrFormatted: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrFormatted)) {
    const d = new Date(isoOrFormatted + 'Z');
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  return isoOrFormatted;
}
