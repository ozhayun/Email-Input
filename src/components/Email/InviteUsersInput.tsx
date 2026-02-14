"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmailPopover } from "./EmailPopover";
import { EmailChip } from "./EmailChip";

import { useEmailInput } from "@/hooks/useEmailInput";
import {
  showBulkResultToast,
  type PasteEmailsResult,
} from "@/lib/formatPasteEmailsResult";
import { parseEmailListFromPastedText } from "@/lib/parseEmailList";

const INPUT_MIN_WIDTH = 100;
const MORE_BUTTON_WIDTH = 48;
const GAP = 8;
const PADDING_X = 16;

export interface InviteUsersInputHandle {
  addEmailsBulk: (rawEmails: string[]) => PasteEmailsResult;
}

interface InviteUsersInputProps {
  initialEmails?: string[];
  onChange?: (emails: string[]) => void;
  onSubmit: (emails: string[]) => void | Promise<void>;
  existingEmails?: string[];
  isSubmitting?: boolean;
}

export const InviteUsersInput = forwardRef<
  InviteUsersInputHandle,
  InviteUsersInputProps
>(function InviteUsersInput(
  {
    initialEmails = [],
    onChange,
    onSubmit,
    existingEmails = [],
    isSubmitting = false,
  },
  ref,
) {
  const [showPopover, setShowPopover] = useState(false);
  const [maxVisibleByWidth, setMaxVisibleByWidth] = useState<number>(
    Number.MAX_SAFE_INTEGER,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const {
    inputValue,
    setInputValue,
    duplicateAttempt,
    removeEmail,
    handleKeyDown,
    handleSubmit,
    visibleEmails,
    hiddenEmails,
    hasHiddenEmails,
    validEmailCount,
    emails,
    addEmailsBulk,
    selectedChipEmail,
    clearSelectedChip,
  } = useEmailInput({
    initialEmails,
    existingEmails,
    maxVisibleChips: maxVisibleByWidth,
    onChange,
    onSubmit,
    onSuccess: (count) =>
      toast.success(`Sent invites to ${count} user${count === 1 ? "" : "s"}`),
    onDuplicateInList: () => toast.error("Email already added to list"),
    onAlreadyInvited: () => toast.error("User already invited"),
    onInvalidEmail: () => toast.error("Please enter a valid email address"),
  });

  useImperativeHandle(ref, () => ({ addEmailsBulk }), [addEmailsBulk]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData?.getData("text");
      const parts = parseEmailListFromPastedText(text ?? "");
      if (parts.length <= 1) return;
      e.preventDefault();
      const result = addEmailsBulk(parts);
      setInputValue("");
      showBulkResultToast(result);
    },
    [addEmailsBulk, setInputValue],
  );

  const updateMaxVisibleByWidth = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure || emails.length === 0) {
      requestAnimationFrame(() =>
        setMaxVisibleByWidth(Number.MAX_SAFE_INTEGER),
      );
      return;
    }

    const containerWidth = container.offsetWidth;
    const reservedWidth =
      PADDING_X * 2 +
      INPUT_MIN_WIDTH +
      GAP +
      (emails.length > 1 ? MORE_BUTTON_WIDTH + GAP : 0);
    const availableWidth = Math.max(0, containerWidth - reservedWidth);

    const chipWrappers = measure.querySelectorAll<HTMLDivElement>(
      "[data-chip-measure]",
    );
    let accumulatedWidth = 0;
    let count = 0;
    for (let i = 0; i < chipWrappers.length; i++) {
      const chipWidth = chipWrappers[i].offsetWidth + GAP;
      if (accumulatedWidth + chipWidth > availableWidth) break;
      accumulatedWidth += chipWidth;
      count++;
    }
    const newMax =
      count === 0 && emails.length > 0 ? 1 : count || Number.MAX_SAFE_INTEGER;
    requestAnimationFrame(() => setMaxVisibleByWidth(newMax));
  }, [emails]);

  useLayoutEffect(() => {
    updateMaxVisibleByWidth();
  }, [updateMaxVisibleByWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateMaxVisibleByWidth);
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [updateMaxVisibleByWidth]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex items-center gap-4 w-full">
          <div
            ref={containerRef}
            className={`
              flex-1 flex flex-nowrap items-center gap-2 p-2 min-h-[40px] min-w-0 overflow-visible
              border rounded-lg bg-white shadow-[0px_1px_2px_0px_#1018280D]
              focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
              transition-all duration-200 cursor-text
              ${duplicateAttempt ? "border-orange-400 bg-orange-50" : "border-gray-200"}
            `}
            onClick={() => inputRef.current?.focus()}
          >
            <div
              ref={measureRef}
              aria-hidden
              className="invisible absolute pointer-events-none flex items-center gap-2 -left-[9999px] -top-[9999px]"
            >
              {emails.map((emailData) => (
                <div key={emailData.email} data-chip-measure>
                  <EmailChip emailData={emailData} onRemove={() => {}} />
                </div>
              ))}
            </div>
            {visibleEmails.map((emailData) => (
              <EmailChip
                key={emailData.email}
                emailData={emailData}
                onRemove={removeEmail}
                isSelected={selectedChipEmail === emailData.email}
                className="shrink-0"
              />
            ))}

            {hasHiddenEmails && (
              <div className="relative shrink-0">
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
              onChange={(e) => {
                setInputValue(e.target.value);
                clearSelectedChip();
              }}
              onBlur={clearSelectedChip}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
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
});
