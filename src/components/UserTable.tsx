"use client";

import { useState } from "react";
import { SubmittedUser } from "@/types/user";
import { formatAddedOn } from "@/lib/format";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const ROLES: SubmittedUser["role"][] = ["Admin", "Guest", "Editor", "Viewer"];

interface UserTableProps {
  users: SubmittedUser[];
  onRemove: (id: string) => void;
  onRoleChange?: (userId: string, role: SubmittedUser["role"]) => void;
  pageSize?: number;
}

export function UserTable({
  users,
  onRemove,
  onRoleChange,
  pageSize = 10,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const start = (effectivePage - 1) * pageSize;
  const pageUsers = users.slice(start, start + pageSize);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-[#DEE5EE]">
          <tr>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">
              User Name
            </th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">
              Email
            </th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">
              Status
            </th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">
              Added On
            </th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">
              Role
            </th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {pageUsers.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                No users found. Add some below.
              </td>
            </tr>
          ) : (
            pageUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br ${user.gradient}`}
                    >
                      {user.initials}
                    </div>
                    <span className="text-sm font-medium text-[#253047]">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2B303D]">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-[#D1FADF] text-[#027A48] border-[#B2F5C9]"
                        : user.status === "Inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2B303D]">
                  {formatAddedOn(user.addedOn)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-[#D0D5DD] text-[#2B303D] py-1.5 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                      value={user.role}
                      onChange={(e) =>
                        onRoleChange?.(
                          user.id,
                          e.target.value as SubmittedUser["role"],
                        )
                      }
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-[#2B303D]">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onRemove(user.id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                    title="Remove user"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {users.length > pageSize && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#DEE5EE] bg-gray-50 rounded-b-xl">
          <p className="text-sm text-gray-600">
            Page {effectivePage} of {totalPages}
            <span className="ml-2 text-gray-400">
              ({users.length} user{users.length !== 1 ? "s" : ""})
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={effectivePage <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={effectivePage >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
