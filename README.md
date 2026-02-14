# User Invite – Email Input

A React user-management UI with an email invite component: add users by email (chips), submit with a dummy API, and view them in a paginated table. Built with Next.js, TypeScript, and Tailwind CSS.

**Live demo:** [chamelio-email-input.netlify.app](https://chamelio-email-input.netlify.app/)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Reset**, **Remove All**, or **Paste Emails** in the header.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**, **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (popover transitions)
- **Lucide React** (icons)
- **Sonner** (toasts)

## Features

- **Invite by email:** Add multiple emails as chips (Enter, Space, comma). Paste comma/newline-separated lists. Validation, duplicate check, remove per chip.
- **Submit:** “Add Users” runs a dummy API (2s delay), logs the final email list to the console, then adds users to the table. Loading state and overlay during submit.
- **Overflow (+X):** When chips exceed the row width, a “+N” badge opens a popover (Framer Motion) listing hidden emails; each has an X to remove.
- **Table:** Users list with avatar, name, email, status, date, role dropdown, remove action. Pagination: 10 per page, controls below the card.
- **Persistence:** Users and role changes are stored in `localStorage`. Initial render uses static data to avoid hydration mismatch; localStorage is applied after mount.

## Project structure

```
src/
  app/              # Next.js app (page, layout, globals)
  components/
    Email/          # Invite input: InviteUsersInput, EmailChip, EmailPopover
    Table/          # User table: UserTable, TableHeader, UserTableRow, StatusBadge, TablePagination
    UserManagement.tsx
    SettingsHeader.tsx
  lib/              # formatDate, formatPasteEmailsResult, parseEmailList, user.ts, api.ts
  types/            # user.ts (SubmittedUser, EmailChipData, etc.)
  hooks/            # useEmailInput, usePasteEmails
_data/
  initial-users.json
  paste-emails.json # Sample emails for Paste Emails button
```

## Dummy API

On submit, `lib/api.ts` runs `submitInviteEmails(emails)`: 2s delay, then `console.log("[Invite] Final list of emails (after delay):", emails)`. Replace this with a real API when integrating.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |
