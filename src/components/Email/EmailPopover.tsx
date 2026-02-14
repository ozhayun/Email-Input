"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EmailChip } from "./EmailChip";
import { EmailChipData } from "@/types/user";

interface EmailPopoverProps {
  isOpen: boolean;
  emails: EmailChipData[];
  onRemove: (email: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const popoverTransition = {
  initial: { opacity: 0, scale: 0.96, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 4 },
  transition: { duration: 0.15, ease: [0, 0, 0.2, 1] as const },
};

export const EmailPopover: React.FC<EmailPopoverProps> = ({
  isOpen,
  emails,
  onRemove,
  onClose,
  triggerRef,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && emails.length === 0) {
      onClose();
    }
  }, [isOpen, emails.length, onClose]);

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
    <AnimatePresence>
      {isOpen && emails.length > 0 && (
        <motion.div
          ref={popoverRef}
          initial={popoverTransition.initial}
          animate={popoverTransition.animate}
          exit={popoverTransition.exit}
          transition={popoverTransition.transition}
          className="absolute z-50 w-80 max-h-64 overflow-y-auto bg-white rounded-lg border border-[#D0D5DD] p-3"
          style={{
            bottom: "100%",
            marginBottom: "0.5rem",
            left: 0,
            boxShadow:
              "0px 4px 6px -1px rgba(0,0,0,0.08), 0px 2px 4px -2px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex flex-wrap gap-1.5">
            {emails.map((emailData) => (
              <EmailChip
                key={emailData.email}
                emailData={emailData}
                onRemove={onRemove}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
