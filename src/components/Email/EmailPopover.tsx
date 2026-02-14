"use client";

import { useEffect, useRef } from "react";
import { EmailChip } from "./EmailChip";
import { EmailChipData } from "@/types/user";

interface EmailPopoverProps {
  emails: EmailChipData[];
  onRemove: (email: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const EmailPopover: React.FC<EmailPopoverProps> = ({
  emails,
  onRemove,
  onClose,
  triggerRef,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, triggerRef]);

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 mt-2 w-80 max-h-64 overflow-y-auto bg-white rounded-lg shadow-[0px_2px_2px_0px_#38456717] border border-[#D0D5DD] p-3 animate-in fade-in zoom-in-95 duration-100"
      style={{
        bottom: "100%",
        marginBottom: "0.5rem",
        left: "0",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {emails.map((emailData) => (
            <EmailChip
              key={emailData.email}
              emailData={emailData}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
