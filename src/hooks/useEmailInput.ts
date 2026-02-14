import { useState, useCallback } from 'react';
import { EmailChipData } from '@/types/user';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useEmailInput = () => {
    const [emails, setEmails] = useState<EmailChipData[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [duplicateAttempt, setDuplicateAttempt] = useState(false);

    const validateEmail = useCallback((email: string): boolean => {
        return EMAIL_REGEX.test(email.trim());
    }, []);

    const addEmail = useCallback((email: string) => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) return;

        // Check for duplicates
        const isDuplicate = emails.some(e => e.email.toLowerCase() === trimmedEmail);

        if (isDuplicate) {
            setDuplicateAttempt(true);
            setTimeout(() => setDuplicateAttempt(false), 500);
            return;
        }

        const isValid = validateEmail(trimmedEmail);
        setEmails(prev => [...prev, { email: trimmedEmail, isValid }]);
        setInputValue('');
    }, [emails, validateEmail]);

    const removeEmail = useCallback((emailToRemove: string) => {
        setEmails(prev => prev.filter(e => e.email !== emailToRemove));
    }, []);

    const removeLastEmail = useCallback(() => {
        if (emails.length > 0) {
            setEmails(prev => prev.slice(0, -1));
        }
    }, [emails.length]);

    const getValidEmails = useCallback(() => {
        return emails.filter(e => e.isValid).map(e => e.email);
    }, [emails]);

    const clearAllEmails = useCallback(() => {
        setEmails([]);
        setInputValue('');
    }, []);

    return {
        emails,
        inputValue,
        setInputValue,
        duplicateAttempt,
        addEmail,
        removeEmail,
        removeLastEmail,
        getValidEmails,
        clearAllEmails,
        validEmailCount: emails.filter(e => e.isValid).length,
    };
};
