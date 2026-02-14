import type { SubmittedUser } from '@/types/user';
import { formatAddedOn } from '@/lib/format';

const GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
];

function nameFromEmail(email: string): string {
  const namePart = email.split('@')[0];
  return namePart
    .split(/[._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Build SubmittedUser[] from a list of emails (e.g. from invite submit).
 * Each user gets a derived name, initials, today as addedOn, and random role/gradient.
 */
export function createUsersFromEmails(emails: string[]): SubmittedUser[] {
  const now = Date.now();
  const addedOn = formatAddedOn(new Date().toISOString().slice(0, 10));

  return emails.map((email, idx) => {
    const name = nameFromEmail(email);
    const initials = initialsFromName(name);
    return {
      id: `user-${now}-${idx}`,
      email,
      name,
      role: (Math.random() > 0.7 ? 'Admin' : 'Guest') as SubmittedUser['role'],
      status: 'Active' as const,
      addedOn,
      initials,
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    };
  });
}

export { GRADIENTS };
