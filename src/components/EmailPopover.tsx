'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { EmailChipData } from '@/types/user';

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
      // Type assertion needed for event.target
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
    <div
      ref={popoverRef}
      className="absolute z-50 mt-2 w-72 max-h-64 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-3 animate-in fade-in zoom-in-95 duration-100"
      style={{
        bottom: '100%',
        marginBottom: '0.5rem',
        left: '0',
      }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hidden Emails</h3>
        <div className="flex flex-wrap gap-1.5">
          {emails.map((emailData, index) => (
            <PopoverEmailChip
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

interface EmailChipProps {
  emailData: EmailChipData;
  onRemove: (email: string) => void;
}

const PopoverEmailChip: React.FC<EmailChipProps> = ({ emailData, onRemove }) => {
  const { email, isValid } = emailData;

  return (
    <div
      className={`
        inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md text-xs font-medium
        transition-colors duration-200
        ${isValid 
          ? 'bg-gray-100 text-gray-700' 
          : 'bg-red-50 text-red-700 border border-red-200'
        }
      `}
    >
      <span className="max-w-[180px] truncate">{email}</span>
      <button
        onClick={() => onRemove(email)}
        className="text-gray-400 hover:text-gray-600 rounded p-0.5 transition-colors"
        aria-label={`Remove ${email}`}
      >
        <X size={12} />
      </button>
    </div>
  );
};
