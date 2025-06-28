
import React, { useState } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { Settings, Palette, Shield, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsContent: React.FC = () => {
  const { currentTenant, currentUser, updateTenantSettings } = useTenant();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: currentTenant?.name || '',
    domain: currentTenant?.domain || '',
    timezone: currentTenant?.settings?.timezone || 'UTC',
    primaryColor: currentTenant?.settings?.primaryColor || '#3B82F6',
    logoUrl: currentTenant?.settings?.logo || '',
    twoFactorEnabled: false,
    sessionTimeout: '60',
  });

  if (!currentTenant || !currentUser) return null;

  const hasManageSettings = currentUser.permissions.includes('manage_settings');

  if (!hasManageSettings) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access settings.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, primaryColor: color }));
    updateTenantSettings({ primaryColor: color });
    toast({
      title: "Color Updated",
      description: "Primary color has been updated successfully.",
    });
  };

  const handleSaveSettings = () => {
    const settingsToUpdate: Record<string, unknown> = {};
    
    if (activeTab === 'general') {
      settingsToUpdate.timezone = formData.timezone;
      if (formData.logoUrl) {
        settingsToUpdate.logo = formData.logoUrl;
      }
    } else if (activeTab === 'appearance') {
      settingsToUpdate.primaryColor = formData.primaryColor;
    }

    updateTenantSettings(settingsToUpdate);
    
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-8 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mt-8">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your organization settings and preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl border border-gray-200  mt-20">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Domain
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.domain}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="CST">Central Time</option>
                        <option value="MST">Mountain Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/logo.png"
                        value={formData.logoUrl}
                        onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Customization</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                          value={formData.primaryColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                        />
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.primaryColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Changes apply immediately to the dashboard theme
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/logo.png"
                        value={formData.logoUrl}
                        onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button 
                        className={`px-4 py-2 rounded-md transition-colors ${
                          formData.twoFactorEnabled 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        onClick={() => {
                          const newState = !formData.twoFactorEnabled;
                          setFormData(prev => ({ ...prev, twoFactorEnabled: newState }));
                          toast({
                            title: newState ? "2FA Enabled" : "2FA Disabled",
                            description: `Two-factor authentication has been ${newState ? 'enabled' : 'disabled'}.`,
                          });
                        }}
                      >
                        {formData.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                        <p className="text-sm text-gray-500">Automatically log out inactive users</p>
                      </div>
                      <select 
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.sessionTimeout}
                        onChange={(e) => {
                          handleInputChange('sessionTimeout', e.target.value);
                          toast({
                            title: "Session Timeout Updated",
                            description: `Session timeout set to ${e.target.value} minutes.`,
                          });
                        }}
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="240">4 hours</option>
                        <option value="480">8 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleSaveSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
