'use client';

import { useState, useCallback, useEffect } from 'react';
import { InviteUsersInput } from '@/components/InviteUsersInput';

interface SubmittedUser {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Guest' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  addedOn: string;
  initials: string;
  gradient: string;
}

const TABS = ['Users', 'Integrations', 'Notifications'];

const GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500', 
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500'
];

const INITIAL_USERS: SubmittedUser[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    status: "Active",
    addedOn: "2024-01-15",
    role: "Admin",
    initials: "SJ",
    gradient: GRADIENTS[0]
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    status: "Active",
    addedOn: "2024-01-20",
    role: "Editor",
    initials: "MC",
    gradient: GRADIENTS[1]
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma.williams@example.com",
    status: "Inactive",
    addedOn: "2024-02-01",
    role: "Viewer",
    initials: "EW",
    gradient: GRADIENTS[2]
  },
  {
    id: "4",
    name: "James Rodriguez",
    email: "james.rodriguez@example.com",
    status: "Active",
    addedOn: "2024-02-10",
    role: "Editor",
    initials: "JR",
    gradient: GRADIENTS[3]
  },
  {
    id: "5",
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    status: "Pending",
    addedOn: "2024-02-12",
    role: "Viewer",
    initials: "OM",
    gradient: GRADIENTS[4]
  }
];

export default function Home() {
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
    <div className="min-h-screen bg-gray-50 flex justify-center p-8 font-sans">
      <div className="w-full max-w-5xl space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <div className="flex gap-3">
              <button 
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-900 transition-colors"
                title="Reset to default users"
              >
                Reset Defaults
              </button>
              <button 
                onClick={handleRemoveAll}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors"
                title="Remove all users"
              >
                Remove All
              </button>
            </div>
          </div>
          <div className="flex gap-8 border-b border-gray-200">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  pb-3 text-sm font-medium transition-colors relative
                  ${activeTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D6D8DD94] overflow-visible">
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[#D6D8DD94]">
                <tr>
                  <th className="px-6 py-3 text-start text-base font-semibold text-[#2B303D] ">User Name</th>
                  <th className="px-6 py-3 text-start text-base font-semibold text-[#2B303D] ">Email</th>
                  <th className="px-6 py-3 text-start text-base font-semibold text-[#2B303D] ">Status</th>
                  <th className="px-6 py-3 text-start text-base font-semibold text-[#2B303D] ">Added On</th>
                  <th className="px-6 py-3 text-start text-base font-semibold text-[#2B303D] ">Role</th>
                  <th className="px-6 py-3 text-start text-base font-semibold text-[#2B303D] "></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {submittedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No users found. Add some below.
                    </td>
                  </tr>
                ) : (
                  submittedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br ${user.gradient}`}>
                            {user.initials}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.addedOn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select 
                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-1 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                            defaultValue={user.role}
                          >
                            <option>Admin</option>
                            <option>Guest</option>
                            <option>Editor</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                          title="Remove user"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Invite Bar Area */}
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
    </div>
  );
}
