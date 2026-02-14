import { useState, useCallback, useEffect, KeyboardEvent } from "react";
import { EmailChipData } from "@/types/user";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface UseEmailInputParams {
  initialEmails?: string[];
  existingEmails?: string[];
  maxVisibleChips?: number;
  onChange?: (emails: string[]) => void;
  onSubmit: (emails: string[]) => void | Promise<void>;
  onSuccess?: (count: number) => void;
  onDuplicateInList?: () => void;
  onAlreadyInvited?: () => void;
  onInvalidEmail?: () => void;
}

export const useEmailInput = ({
  initialEmails = [],
  existingEmails = [],
  maxVisibleChips = 5,
  onChange,
  onSubmit,
  onSuccess,
  onDuplicateInList,
  onAlreadyInvited,
  onInvalidEmail,
}: UseEmailInputParams) => {
  const [emails, setEmails] = useState<EmailChipData[]>(() =>
    initialEmails.map((email) => ({
      email: email.toLowerCase().trim(),
      isValid: EMAIL_REGEX.test(email.trim()),
    })),
  );
  const [inputValue, setInputValue] = useState("");
  const [duplicateAttempt, setDuplicateAttempt] = useState(false);
  const [selectedChipEmail, setSelectedChipEmail] = useState<string | null>(null);

  useEffect(() => {
    if (onChange) {
      const validEmails = emails.filter((e) => e.isValid).map((e) => e.email);
      onChange(validEmails);
    }
  }, [emails, onChange]);

  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
  }, []);

  const triggerDuplicateAttempt = useCallback(() => {
    setDuplicateAttempt(true);
    setTimeout(() => setDuplicateAttempt(false), 500);
  }, []);

  const addEmail = useCallback(
    (email: string) => {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) return;

      const isDuplicateInInput = emails.some((e) => e.email === trimmedEmail);
      const isAlreadyInvited = existingEmails.includes(trimmedEmail);

      if (isDuplicateInInput || isAlreadyInvited) {
        if (isAlreadyInvited) {
          onAlreadyInvited?.();
        } else {
          onDuplicateInList?.();
        }
        triggerDuplicateAttempt();
        return;
      }

      if (!validateEmail(trimmedEmail)) {
        onInvalidEmail?.();
        triggerDuplicateAttempt();
        return;
      }

      setEmails((prev) => [...prev, { email: trimmedEmail, isValid: true }]);
      setInputValue("");
    },
    [
      emails,
      existingEmails,
      validateEmail,
      onDuplicateInList,
      onAlreadyInvited,
      onInvalidEmail,
      triggerDuplicateAttempt,
    ],
  );

  const removeEmail = useCallback((emailToRemove: string) => {
    setEmails((prev) => prev.filter((e) => e.email !== emailToRemove));
    setSelectedChipEmail((prev) =>
      prev === emailToRemove ? null : prev,
    );
  }, []);

  const removeLastEmail = useCallback((emailToRemove?: string) => {
    setEmails((prev) => {
      if (prev.length === 0) return prev;
      if (emailToRemove) {
        return prev.filter((e) => e.email !== emailToRemove);
      }
      return prev.slice(0, -1);
    });
    setSelectedChipEmail(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "," || e.key === " ") {
        e.preventDefault();
        setSelectedChipEmail(null);
        addEmail(inputValue);
      } else if (e.key === "Backspace" && inputValue === "") {
        e.preventDefault();
        if (emails.length === 0) return;
        const lastEmail = emails[emails.length - 1].email;
        const lastIsVisible = emails.length - 1 < maxVisibleChips;
        if (lastIsVisible) {
          if (selectedChipEmail) {
            removeLastEmail(selectedChipEmail);
          } else {
            setSelectedChipEmail(lastEmail);
          }
        } else {
          removeLastEmail(lastEmail);
        }
      } else {
        setSelectedChipEmail(null);
      }
    },
    [inputValue, addEmail, removeLastEmail, emails, selectedChipEmail, maxVisibleChips],
  );

  const clearSelectedChip = useCallback(() => {
    setSelectedChipEmail(null);
  }, []);

  const clearEmails = useCallback(() => {
    setEmails([]);
    setInputValue("");
  }, []);

  const handleSubmit = useCallback(async () => {
    const email = inputValue.trim().toLowerCase();

    if (email) {
      if (!validateEmail(email)) {
        onInvalidEmail?.();
        triggerDuplicateAttempt();
        return;
      }
      if (existingEmails.includes(email)) {
        onAlreadyInvited?.();
        triggerDuplicateAttempt();
        return;
      }
      if (!emails.some((e) => e.email === email)) {
        const finalEmails = [...emails, { email, isValid: true }];
        const toSubmit = finalEmails.map((e) => e.email);
        await Promise.resolve(onSubmit(toSubmit));
        clearEmails();
        onSuccess?.(finalEmails.length);
        return;
      }
      setInputValue("");
      return;
    }

    if (emails.length > 0) {
      const toSubmit = emails.map((e) => e.email);
      await Promise.resolve(onSubmit(toSubmit));
      clearEmails();
      onSuccess?.(emails.length);
    }
  }, [
    inputValue,
    emails,
    existingEmails,
    validateEmail,
    triggerDuplicateAttempt,
    onInvalidEmail,
    onAlreadyInvited,
    onSubmit,
    onSuccess,
    clearEmails,
    setInputValue,
  ]);

  const addEmailsBulk = useCallback(
    (rawEmails: string[]): {
      added: number;
      invalid: number;
      skippedInInput: number;
      skippedInvited: number;
    } => {
      let invalid = 0;
      const validUnique = new Set<string>();

      for (const raw of rawEmails) {
        const trimmed = raw.trim().toLowerCase();
        if (!trimmed) continue;
        if (EMAIL_REGEX.test(trimmed)) {
          validUnique.add(trimmed);
        } else {
          invalid++;
        }
      }

      const inInput = new Set(emails.map((e) => e.email));
      const invited = new Set(existingEmails);
      let skippedInInput = 0;
      let skippedInvited = 0;

      const toAdd = Array.from(validUnique).filter((e) => {
        if (inInput.has(e)) {
          skippedInInput++;
          return false;
        }
        if (invited.has(e)) {
          skippedInvited++;
          return false;
        }
        return true;
      });

      setEmails((prev) => [
        ...prev,
        ...toAdd.map((email) => ({ email, isValid: true })),
      ]);

      return {
        added: toAdd.length,
        invalid,
        skippedInInput,
        skippedInvited,
      };
    },
    [existingEmails, emails],
  );

  const visibleEmails = emails.slice(0, maxVisibleChips);
  const hiddenEmails = emails.slice(maxVisibleChips);
  const hasHiddenEmails = hiddenEmails.length > 0;
  const validEmailCount = emails.filter((e) => e.isValid).length;

  return {
    emails,
    inputValue,
    setInputValue,
    duplicateAttempt,
    addEmail,
    addEmailsBulk,
    handleSubmit,
    removeEmail,
    removeLastEmail,
    handleKeyDown,
    clearEmails,
    clearSelectedChip,
    validateEmail,
    triggerDuplicateAttempt,
    visibleEmails,
    hiddenEmails,
    hasHiddenEmails,
    validEmailCount,
    selectedChipEmail,
  };
};
