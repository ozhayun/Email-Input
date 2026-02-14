"use client";

import { SubmittedUser } from "@/types/user";
import { TableHeader } from "./TableHeader";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: SubmittedUser[];
  currentPage: number;
  pageSize?: number;
  onRemove: (id: string) => void;
  onRoleChange?: (userId: string, role: SubmittedUser["role"]) => void;
}

export function UserTable({
  users,
  currentPage,
  pageSize = 10,
  onRemove,
  onRoleChange,
}: UserTableProps) {
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const start = (effectivePage - 1) * pageSize;
  const pageUsers = users.slice(start, start + pageSize);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <TableHeader />
        <tbody className="divide-y divide-gray-100 bg-white">
          {pageUsers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-gray-400"
              >
                No users found. Add some below.
              </td>
            </tr>
          ) : (
            pageUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onRemove={onRemove}
                onRoleChange={onRoleChange}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
