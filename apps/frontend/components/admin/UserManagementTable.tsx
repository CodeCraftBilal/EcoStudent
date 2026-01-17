"use client";
import { MoreVertical, UserX, Trash2 } from "lucide-react";
import { useState } from "react";
const initialUsers = [
  { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Student", status: "Active", joined: "2024-01-12" },
  { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "Student", status: "Active", joined: "2024-01-15" },
  { id: 3, name: "John Doe", email: "john@example.com", role: "Student", status: "Suspended", joined: "2023-12-10" },
  { id: 4, name: "Admin User", email: "admin@ecostudent.com", role: "Admin", status: "Active", joined: "2023-11-01" },
];
export default function UserManagementTable() {
  const [users, setUsers] = useState(initialUsers);
  const handleDelete = (id: number) => {
      if(confirm('Are you sure you want to delete this user?')) {
        setUsers(users.filter(u => u.id !== id));
      }
  };
  const handleStatusChange = (id: number) => {
      setUsers(users.map(u => u.id === id ? {...u, status: u.status === 'Active' ? 'Suspended' : 'Active'} : u));
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joined}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleStatusChange(user.id)} className="text-orange-600 hover:text-orange-900 p-1" title={user.status === 'Active' ? 'Suspend' : 'Activate'}>
                      <UserX className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 p-1" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
