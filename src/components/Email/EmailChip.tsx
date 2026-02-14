"use client";

import { X } from "lucide-react";
import { EmailChipData } from "@/types/user";

export interface EmailChipProps {
  emailData: EmailChipData;
  onRemove: (email: string) => void;
}

export const EmailChip: React.FC<EmailChipProps> = ({ emailData, onRemove }) => {
  const { email, isValid } = emailData;

  return (
    <div
      className={`
        inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md text-sm
        transition-colors duration-200
        ${
          isValid
            ? "bg-[#ECF1FC] text-[gray-700]"
            : "bg-red-50 text-red-700 border border-red-200"
        }
      `}
    >
      <span className="max-w-[250px] truncate text-sm text-[#253047]">{email}</span>
      <button
        onClick={() => onRemove(email)}
        className="rounded-md p-0.5 text-[#253047]/40 hover:text-[#253047]"
        aria-label={`Remove ${email}`}
      >
        <X size={14} />
      </button>
    </div>
  );
};
