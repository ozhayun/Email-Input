'use client';

import { Users, Bell, Settings, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-500">Manage and invite users to your workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
              <Bell size={20} className="text-gray-600" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Settings">
              <Settings size={20} className="text-gray-600" />
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
