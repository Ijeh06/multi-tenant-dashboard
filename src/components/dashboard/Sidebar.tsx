
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, Settings, LogOut, UserCheck, Eye, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { currentTenant, currentUser } = useTenant();
  const { signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    toast.success('You have been signed out successfully.');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { 
        name: 'Admin Dashboard', 
        icon: LayoutDashboard, 
        href: '/', 
        current: location.pathname === '/',
        requiredRole: 'admin'
      },
      { 
        name: 'Manager Dashboard', 
        icon: UserCheck, 
        href: '/manager-dashboard', 
        current: location.pathname === '/manager-dashboard',
        requiredRole: 'manager'
      },
      { 
        name: 'My Dashboard', 
        icon: Eye, 
        href: '/viewer-dashboard', 
        current: location.pathname === '/viewer-dashboard',
        requiredRole: 'viewer'
      },
      { 
        name: 'Users', 
        icon: Users, 
        href: '/users', 
        current: location.pathname === '/users', 
        requiredPermission: 'manage_users' 
      },
      { 
        name: 'Settings', 
        icon: Settings, 
        href: '/settings', 
        current: location.pathname === '/settings', 
        requiredPermission: 'manage_settings' 
      },
    ];

    return baseItems.filter(item => {
      if (item.requiredRole) {
        return currentUser?.role === item.requiredRole;
      }
      if (item.requiredPermission) {
        return currentUser?.permissions.includes(item.requiredPermission);
      }
      return true;
    });
  };

  if (!currentTenant || !currentUser) return null;

  const navigation = getNavigationItems();

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static
        inset-y-0 left-0
        z-50 lg:z-auto
        w-64 h-full bg-slate-900 flex flex-col
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Logo/Tenant Header */}
          <div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-slate-700 mt-12 lg:mt-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentTenant.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{currentTenant.name}</p>
                <p className="text-xs text-slate-400 capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  // Close mobile menu when navigating
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`
                  ${item.current
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                `}
              >
                <item.icon
                  className={`
                    ${item.current ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}
                    mr-3 flex-shrink-0 h-5 w-5
                  `}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex-shrink-0 border-t border-slate-700 p-4">
            <div className="flex items-center">
              <div>
                <div className="h-9 w-9 rounded-full bg-slate-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-white">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white cursor-pointer transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
