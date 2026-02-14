"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const POPOVER_GAP_PX = 8;
const POPOVER_WIDTH_PX = 320; // w-80

export const EmailPopover: React.FC<EmailPopoverProps> = ({
  isOpen,
  emails,
  onRemove,
  onClose,
  triggerRef,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, bottom: 0 });

  useEffect(() => {
    if (isOpen && emails.length === 0) {
      onClose();
    }
  }, [isOpen, emails.length, onClose]);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      left: rect.right - POPOVER_WIDTH_PX,
      bottom: window.innerHeight - rect.top + POPOVER_GAP_PX,
    });
  }, [isOpen, triggerRef, emails.length]);

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
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, triggerRef]);

  const popoverContent =
    isOpen && emails.length > 0 ? (
      <AnimatePresence>
        <motion.div
          ref={popoverRef}
          initial={popoverTransition.initial}
          animate={popoverTransition.animate}
          exit={popoverTransition.exit}
          transition={popoverTransition.transition}
          className="fixed z-[9999] w-80 max-h-64 overflow-y-auto bg-white rounded-lg border border-[#D0D5DD] p-3 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.08),0px_2px_4px_-2px_rgba(0,0,0,0.05)]"
          style={{ left: position.left, bottom: position.bottom }}
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
      </AnimatePresence>
    ) : null;

  if (typeof document === "undefined") return null;
  return createPortal(popoverContent, document.body);
};
