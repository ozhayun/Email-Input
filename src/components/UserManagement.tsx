"use client";

import { useState, useCallback, useEffect } from "react";
import { InviteUsersInput } from "@/components/Email";
import { UserTable, TablePagination } from "@/components/Table";
import { SettingsHeader } from "@/components/SettingsHeader";
import { SubmittedUser, InitialUserRow } from "@/types/user";
import { formatAddedOn } from "@/lib/format";
import { createUsersFromEmails, GRADIENTS } from "@/lib/user";
import { submitInviteEmails } from "@/lib/api";

import initialUsersData from "../../_data/initial-users.json";

const INITIAL_USERS: SubmittedUser[] = (
  initialUsersData as InitialUserRow[]
).map((user, index) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  status: user.status as SubmittedUser["status"],
  addedOn: formatAddedOn(user.addedOn),
  role: user.role as SubmittedUser["role"],
  initials: user.avatar,
  gradient: GRADIENTS[index % GRADIENTS.length],
}));

const PAGE_SIZE = 10;

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("Users");
  const [submittedUsers, setSubmittedUsers] =
    useState<SubmittedUser[]>(INITIAL_USERS);
  const [tablePage, setTablePage] = useState(1);
  const [isAddingUsers, setIsAddingUsers] = useState(false);

  // Load from localStorage after mount (client-only). Same initial state on server and client avoids hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("submittedUsers");
      if (saved) {
        const parsed = JSON.parse(saved) as SubmittedUser[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubmittedUsers(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse users from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("submittedUsers", JSON.stringify(submittedUsers));
  }, [submittedUsers]);

  const handleReset = useCallback(() => {
    if (confirm("Are you sure you want to reset to default users?")) {
      setSubmittedUsers(INITIAL_USERS);
    }
  }, []);

  const handleRemoveAll = useCallback(() => {
    if (confirm("Are you sure you want to remove ALL users?")) {
      setSubmittedUsers([]);
    }
  }, []);

  const handleRemoveUser = useCallback((userId: string) => {
    setSubmittedUsers((prev) => prev.filter((user) => user.id !== userId));
  }, []);

  const handleRoleChange = useCallback(
    (userId: string, role: SubmittedUser["role"]) => {
      setSubmittedUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
    },
    [],
  );

  const handleSubmit = useCallback(async (emails: string[]) => {
    setIsAddingUsers(true);
    try {
      await submitInviteEmails(emails);
      const newUsers = createUsersFromEmails(emails);
      setSubmittedUsers((prev) => [...newUsers, ...prev]);
    } finally {
      setIsAddingUsers(false);
    }
  }, []);

  return (
    <div className="w-full max-w-5xl space-y-6">
      <SettingsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleReset}
        onRemoveAll={handleRemoveAll}
      />

      <div className="relative bg-white rounded-xl shadow-sm border border-[#D6D8DD94] overflow-visible">
        {isAddingUsers && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-[2px]"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D6D8DD] border-t-[#1852E7]" />
              <p className="text-sm font-medium text-[#2B303D]">
                Updating users table…
              </p>
            </div>
          </div>
        )}

        <UserTable
          users={submittedUsers}
          currentPage={tablePage}
          pageSize={PAGE_SIZE}
          onRemove={handleRemoveUser}
          onRoleChange={handleRoleChange}
        />

        <div className="p-4 border-t border-[#D6D8DD94] border-b-0 rounded-b-xl">
          <InviteUsersInput
            initialEmails={[]}
            onSubmit={handleSubmit}
            maxVisibleChips={5}
            existingEmails={submittedUsers.map((u) => u.email)}
            isSubmitting={isAddingUsers}
          />
        </div>
      </div>

      {submittedUsers.length > PAGE_SIZE && (
        <TablePagination
          currentPage={Math.min(
            tablePage,
            Math.ceil(submittedUsers.length / PAGE_SIZE),
          )}
          totalPages={Math.ceil(submittedUsers.length / PAGE_SIZE)}
          totalCount={submittedUsers.length}
          onPrevious={() => setTablePage((p) => Math.max(1, p - 1))}
          onNext={() =>
            setTablePage((p) =>
              Math.min(Math.ceil(submittedUsers.length / PAGE_SIZE), p + 1),
            )
          }
        />
      )}
    </div>
  );
}
