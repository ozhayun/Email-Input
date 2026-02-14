'use client';

import { SubmittedUser } from '@/types/user';
import { formatAddedOn } from '@/lib/format';
import { Trash2 } from 'lucide-react';

interface UserTableProps {
  users: SubmittedUser[];
  onRemove: (id: string) => void;
}

export function UserTable({ users, onRemove }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">User Name</th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">Email</th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">Status</th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">Added On</th>
            <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]">Role</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                No users found. Add some below.
              </td>
            </tr>
          ) : (
            users.map((user) => (
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' :
                    user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatAddedOn(user.addedOn)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative">
                    <select 
                      className="appearance-none bg-white border border-gray-200 text-[#2B303D] py-1 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                      defaultValue={user.role}
                    >
                      <option>Admin</option>
                      <option>Guest</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-[#2B303D]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => onRemove(user.id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                    title="Remove user"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
