'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { EmailChipData } from '@/types/user';

interface EmailChipProps {
  emailData: EmailChipData;
  onRemove: (email: string) => void;
  index: number;
}

export const EmailChip: React.FC<EmailChipProps> = ({ emailData, onRemove, index }) => {
  const { email, isValid } = emailData;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
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
    </motion.div>
  );
};
