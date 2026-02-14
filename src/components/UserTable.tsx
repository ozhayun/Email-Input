'use client';

import { motion } from 'framer-motion';
import { Trash2, ChevronDown } from 'lucide-react';
import { User } from '@/types/user';

interface UserTableProps {
  users: User[];
  onDeleteUser: (userId: string) => void;
}

const getStatusColor = (status: User['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Inactive':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getRoleColor = (role: User['role']) => {
  switch (role) {
    case 'Admin':
      return 'bg-purple-100 text-purple-700';
    case 'Editor':
      return 'bg-blue-100 text-blue-700';
    case 'Viewer':
      return 'bg-teal-100 text-teal-700';
    case 'Guest':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const UserTable: React.FC<UserTableProps> = ({ users, onDeleteUser }) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Added On
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.avatar}
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(user.addedOn).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative inline-block">
                  <select
                    value={user.role}
                    onChange={() => {}} // Visual only, no functionality
                    className={`appearance-none px-3 py-1 pr-8 text-xs font-medium rounded-lg border-0 cursor-pointer ${getRoleColor(user.role)}`}
                    disabled
                  >
                    <option>{user.role}</option>
                  </select>
                  <ChevronDown 
                    size={14} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors duration-150"
                  aria-label={`Delete ${user.name}`}
                >
                  <Trash2 size={18} />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
