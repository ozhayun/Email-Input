"use client";

import { SubmittedUser } from "@/types/user";

interface StatusBadgeProps {
  status: SubmittedUser["status"];
}

const STATUS_STYLES: Record<SubmittedUser["status"], string> = {
  Active: "bg-[#D1FADF] text-[#027A48] border border-[#B2F5C9]",
  Inactive: "bg-gray-100 text-gray-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
