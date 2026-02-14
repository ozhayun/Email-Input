"use client";

import { Trash2 } from "lucide-react";
import { SubmittedUser } from "@/types/user";
import { formatAddedOn } from "@/lib/formatDate";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";

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
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap max-w-[200px]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br ${user.gradient}`}
          >
            {user.initials}
          </div>
          <span
            className="text-sm font-medium text-[#253047] truncate block min-w-0"
            title={user.name}
          >
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
        <StatusBadge status={user.status} />
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
            <Image
              src="/chevron.svg"
              alt="Chevron down"
              width={16}
              height={16}
            />
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
