
import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { currentTenant, addUser } = useTenant();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'manager' | 'viewer',
    department: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTenant) return;

    const permissions = {
      admin: ['view_all', 'edit_all', 'manage_users', 'manage_settings'],
      manager: ['view_department', 'edit_department', 'manage_team'],
      viewer: ['view_assigned'],
    };

    const newUser = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      tenantId: currentTenant.id,
      permissions: permissions[formData.role],
      ...(formData.department && { department: formData.department }),
    };

    addUser(newUser);
    
    toast({
      title: "User Added",
      description: `${formData.name} has been added successfully.`,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      role: 'viewer',
      department: '',
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department (Optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="Enter department"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
