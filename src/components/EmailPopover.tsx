'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface EmailChipData {
  email: string;
  isValid: boolean;
}

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
  triggerRef 
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, triggerRef]);

  return (
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute z-50 mt-2 w-80 max-h-64 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-4"
        style={{
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">All Email Addresses</h3>
          <div className="flex flex-wrap gap-2">
            {emails.map((emailData, index) => (
              <PopoverEmailChip
                key={emailData.email}
                emailData={emailData}
                onRemove={onRemove}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Inline EmailChip for popover (no animations needed here)
interface EmailChipProps {
  emailData: EmailChipData;
  onRemove: (email: string) => void;
  index: number;
}

const PopoverEmailChip: React.FC<EmailChipProps> = ({ emailData, onRemove }) => {
  const { email, isValid } = emailData;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200
        ${isValid 
          ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200' 
          : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
        }
      `}
    >
      <span className="max-w-[200px] truncate">{email}</span>
      <button
        onClick={() => onRemove(email)}
        className="hover:bg-white/50 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${email}`}
      >
        <X size={14} />
      </button>
    </div>
  );
};
