
import React, { useState } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { Users, UserPlus, Edit, Trash2, Shield, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddUserModal from './AddUserModal';

const UsersContent: React.FC = () => {
  const { currentTenant, currentUser, users, removeUser, updateUser } = useTenant();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  if (!currentTenant || !currentUser) return null;

  const hasManageUsers = currentUser.permissions.includes('manage_users');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesDepartment = !departmentFilter || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleRemoveUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to remove ${userName}?`)) {
      removeUser(userId);
      toast({
        title: "User Removed",
        description: `${userName} has been removed successfully.`,
      });
    }
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'manager' | 'viewer') => {
    const permissions = {
      admin: ['view_all', 'edit_all', 'manage_users', 'manage_settings'],
      manager: ['view_department', 'edit_department', 'manage_team'],
      viewer: ['view_assigned'],
    };

    updateUser(userId, { role: newRole, permissions: permissions[newRole] });
    setEditingUser(null);
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`,
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];

  if (!hasManageUsers) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-8 h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mt-8">Users</h1>
              <p className="text-gray-600 mt-1">Manage team members and their permissions</p>
            </div>
            <button 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsAddUserModalOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white  rounded-full shadow-xl border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                // className="px-6 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // value={roleFilter}
                // onChange ={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>
              <select 
                // className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // value={departmentFilter}
                // onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-full shadow-2xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <select
                          className="px-2 py-1 text-xs font-semibold rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          onBlur={() => setEditingUser(null)}
                          autoFocus
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      ) : (
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${getRoleBadgeColor(user.role)}`}
                          onClick={() => setEditingUser(user.id)}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          onClick={() => setEditingUser(user.id)}
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.id !== currentUser.id && (
                          <button 
                            className="text-red-600 hover:text-red-900 transition-colors"
                            onClick={() => handleRemoveUser(user.id, user.name)}
                            title="Remove user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 " />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
};

export default UsersContent;
