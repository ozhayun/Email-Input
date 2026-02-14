"use client";

import { Trash2 } from "lucide-react";
import { SubmittedUser } from "@/types/user";
import { formatAddedOn } from "@/lib/format";

const ROLES: SubmittedUser["role"][] = ["Admin", "Guest", "Editor", "Viewer"];

interface UserTableRowProps {
  user: SubmittedUser;
  onRemove: (id: string) => void;
  onRoleChange?: (userId: string, role: SubmittedUser["role"]) => void;
}

export function UserTableRow({
  user,
  onRemove,
  onRoleChange,
}: UserTableRowProps) {
  return (
    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap max-w-[200px]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br ${user.gradient}`}
          >
            {user.initials}
          </div>
          <span className="text-sm font-medium text-[#253047] truncate block min-w-0" title={user.name}>
            {user.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2B303D] max-w-[220px]">
        <span className="block truncate" title={user.email}>
          {user.email}
        </span>
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
      <td className="px-6 py-4 whitespace-nowrap w-[140px] min-w-[140px]">
        <div className="relative w-full min-w-[120px]">
          <select
            className="appearance-none bg-white border border-[#D0D5DD] text-[#2B303D] py-1.5 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm w-full min-w-[100px]"
            value={user.role}
            onChange={(e) =>
              onRoleChange?.(user.id, e.target.value as SubmittedUser["role"])
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
              className="fill-current h-4 w-4 shrink-0"
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
  );
}
