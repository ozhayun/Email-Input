'use client';

import { Home, Users, BarChart3, FileText, Folder } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', active: false },
  { icon: Users, label: 'Users', active: true },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: FileText, label: 'Reports', active: false },
  { icon: Folder, label: 'Projects', active: false },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 font-medium
                    ${item.active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
