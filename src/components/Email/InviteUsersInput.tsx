"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmailPopover } from "./EmailPopover";
import { EmailChip } from "./EmailChip";

import { EmailChipData } from "@/types/user";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface InviteUsersInputProps {
  initialEmails?: string[];
  onChange?: (emails: string[]) => void;
  onSubmit: (emails: string[]) => void | Promise<void>;
  maxVisibleChips?: number;
  existingEmails?: string[];
  isSubmitting?: boolean;
}

export const InviteUsersInput: React.FC<InviteUsersInputProps> = ({
  initialEmails = [],
  onChange,
  onSubmit,
  maxVisibleChips = 5,
  existingEmails = [],
  isSubmitting = false,
}) => {
  const [emails, setEmails] = useState<EmailChipData[]>(() =>
    initialEmails.map((email) => ({
      email: email.toLowerCase().trim(),
      isValid: EMAIL_REGEX.test(email.trim()),
    })),
  );
  const [inputValue, setInputValue] = useState("");
  const [duplicateAttempt, setDuplicateAttempt] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (onChange) {
      const validEmails = emails.filter((e) => e.isValid).map((e) => e.email);
      onChange(validEmails);
    }
  }, [emails, onChange]);

  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) return;

    const isDuplicateInInput = emails.some((e) => e.email === trimmedEmail);
    const isAlreadyInvited = existingEmails.includes(trimmedEmail);

    if (isDuplicateInInput || isAlreadyInvited) {
      if (isAlreadyInvited) {
        toast.error("User already invited");
      } else {
        toast.error("Email already added to list");
      }
      setDuplicateAttempt(true);
      setTimeout(() => setDuplicateAttempt(false), 500);
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      setDuplicateAttempt(true);
      setTimeout(() => setDuplicateAttempt(false), 500);
      return;
    }

    setEmails((prev) => [...prev, { email: trimmedEmail, isValid: true }]);
    setInputValue("");
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails((prev) => prev.filter((e) => e.email !== emailToRemove));
  };

  const removeLastEmail = () => {
    if (emails.length > 0) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === "Backspace" && inputValue === "") {
      removeLastEmail();
    }
  };

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      const email = inputValue.trim().toLowerCase();

      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address");
        setDuplicateAttempt(true);
        setTimeout(() => setDuplicateAttempt(false), 500);
        return;
      }

      if (existingEmails.includes(email)) {
        toast.error("User already invited");
        setDuplicateAttempt(true);
        setTimeout(() => setDuplicateAttempt(false), 500);
        return;
      }

      if (!emails.some((e) => e.email === email)) {
        const finalEmails = [...emails, { email, isValid: true }];
        const toSubmit = finalEmails.map((e) => e.email);
        await Promise.resolve(onSubmit(toSubmit));
        setEmails([]);
        setInputValue("");
        toast.success(
          `Sent invites to ${finalEmails.length} user${finalEmails.length > 1 ? "s" : ""}`,
        );
        return;
      } else {
        setInputValue("");
      }
    }

    if (emails.length > 0) {
      const toSubmit = emails.map((e) => e.email);
      await Promise.resolve(onSubmit(toSubmit));
      setEmails([]);
      setInputValue("");
      toast.success(
        `Sent invites to ${emails.length} user${emails.length > 1 ? "s" : ""}`,
      );
    }
  };

  const visibleEmails = emails.slice(0, maxVisibleChips);
  const hiddenEmails = emails.slice(maxVisibleChips);
  const hasHiddenEmails = hiddenEmails.length > 0;
  const validEmailCount = emails.filter((e) => e.isValid).length;

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex items-center gap-4 w-full">
          <div
            className={`
              flex-1 flex flex-wrap items-center gap-2 p-2 min-h-[40px]
              border rounded-lg bg-white
              focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
              transition-all duration-200 cursor-text
              ${duplicateAttempt ? "border-orange-400 bg-orange-50" : "border-gray-200"}
            `}
            style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
            onClick={() => inputRef.current?.focus()}
          >
            {visibleEmails.map((emailData) => (
              <EmailChip
                key={emailData.email}
                emailData={emailData}
                onRemove={removeEmail}
              />
            ))}

            {hasHiddenEmails && (
              <div className="relative">
                <button
                  ref={moreButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPopover(!showPopover);
                  }}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium
                    bg-[#ECF1FC] text-[#253047] hover:bg-[#d6e1f9]
                    transition-colors duration-200"
                >
                  +{hiddenEmails.length}
                </button>

                <EmailPopover
                  isOpen={showPopover}
                  emails={hiddenEmails}
                  onRemove={removeEmail}
                  onClose={() => setShowPopover(false)}
                  triggerRef={moreButtonRef}
                />
              </div>
            )}

            <input
              ref={inputRef}
              id="email-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={emails.length === 0 ? "Enter emails..." : ""}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-[#253047] placeholder-[#667085]"
              aria-label="Email input field"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={validEmailCount === 0 || isSubmitting}
            aria-busy={isSubmitting}
            aria-disabled={validEmailCount === 0 || isSubmitting}
            className={`
              inline-flex items-center justify-center gap-2 px-6 py-1 rounded-lg font-medium text-sm whitespace-nowrap
              transition-colors duration-200 h-[40px] min-w-[120px]
              ${
                validEmailCount > 0 && !isSubmitting
                  ? "bg-[#1852E7] text-white hover:bg-[#164bc7] border border-[#336CFF] shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_4px_0px_#0638BA_inset,0px_2px_3.4px_0px_#FBFBFB4D_inset]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding…
              </>
            ) : validEmailCount > 0 ? (
              `Add Users (${validEmailCount})`
            ) : (
              `Add Users`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
