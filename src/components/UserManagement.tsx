'use client';

import { useState, useCallback, useEffect } from 'react';
import { InviteUsersInput } from '@/components/InviteUsersInput';
import { UserTable } from '@/components/UserTable';
import { SettingsHeader } from '@/components/SettingsHeader';
import { SubmittedUser } from '@/types/user';

import initialUsersData from '../../_data/initial-users.json';

const GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500', 
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500'
];

// Map JSON data to SubmittedUser type
const INITIAL_USERS: SubmittedUser[] = (initialUsersData as any[]).map((user, index) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  status: user.status as any,
  addedOn: user.addedOn,
  role: user.role as any,
  initials: user.avatar, // JSON has 'avatar' with initials
  gradient: GRADIENTS[index % GRADIENTS.length]
}));

export function UserManagement() {
  const [activeTab, setActiveTab] = useState('Users');
  const [submittedUsers, setSubmittedUsers] = useState<SubmittedUser[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('submittedUsers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setSubmittedUsers(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse users from localStorage', e);
      }
    }
    // If no saved data or empty, load initial
    setSubmittedUsers(INITIAL_USERS);
  }, []);

  // Save to localStorage whenever submittedUsers changes
  useEffect(() => {
    localStorage.setItem('submittedUsers', JSON.stringify(submittedUsers));
  }, [submittedUsers]);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset to default users?')) {
      setSubmittedUsers(INITIAL_USERS);
    }
  }, []);

  const handleRemoveAll = useCallback(() => {
    if (confirm('Are you sure you want to remove ALL users?')) {
      setSubmittedUsers([]);
    }
  }, []);

  const handleRemoveUser = useCallback((userId: string) => {
    setSubmittedUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  const handleSubmit = useCallback((emails: string[]) => {
    const newUsers: SubmittedUser[] = emails.map((email, idx) => {
      const namePart = email.split('@')[0];
      const name = namePart
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const initials = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const date = new Date();
      /* Format Example: January 15, 2024 */
      const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      return {
        id: `user-${Date.now()}-${idx}`,
        email,
        name,
        role: Math.random() > 0.7 ? 'Admin' : 'Guest',
        status: 'Active',
        addedOn: formattedDate,
        initials,
        gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
      };
    });

    setSubmittedUsers(prev => [...newUsers, ...prev]);
  }, []);

  return (
    <div className="w-full max-w-5xl space-y-6">
      <SettingsHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onReset={handleReset}
        onRemoveAll={handleRemoveAll}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
        <UserTable users={submittedUsers} onRemove={handleRemoveUser} />
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 border-b-0 rounded-b-xl">
           <InviteUsersInput
              initialEmails={[]}
              onSubmit={handleSubmit}
              maxVisibleChips={5}
              existingEmails={submittedUsers.map(u => u.email)}
            />
        </div>
      </div>
    </div>
  );
}
