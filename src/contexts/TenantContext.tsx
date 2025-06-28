
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, User, AnalyticsData } from '../types/tenant';

interface TenantContextType {
  currentTenant: Tenant | null;
  currentUser: User | null;
  analyticsData: AnalyticsData | null;
  users: User[];
  loading: boolean;
  setTenant: (tenantId: string) => void;
  setUser: (user: User) => void;
  refreshAnalytics: () => void;
  updateTenantSettings: (settings: Partial<Tenant['settings']>) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Mock data
const mockTenants: Tenant[] = [
  {
    id: 'acme-corp',
    name: 'Acme Corporation',
    domain: 'acme-corp',
    settings: {
      primaryColor: '#3B82F6',
      timezone: 'UTC',
    },
  },
  {
    id: 'tech-solutions',
    name: 'Tech Solutions Inc',
    domain: 'tech-solutions',
    settings: {
      primaryColor: '#10B981',
      timezone: 'UTC',
    },
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rolake Admin',
    email: 'admin@acme-corp.com',
    role: 'admin',
    tenantId: 'acme-corp',
    permissions: ['view_all', 'edit_all', 'manage_users', 'manage_settings'],
  },
  {
    id: '2',
    name: 'Jane Manager',
    email: 'manager@acme-corp.com',
    role: 'manager',
    tenantId: 'acme-corp',
    permissions: ['view_department', 'edit_department', 'manage_team'],
    department: 'Sales',
  },
  {
    id: '3',
    name: 'Bob Viewer',
    email: 'viewer@acme-corp.com',
    role: 'viewer',
    tenantId: 'acme-corp',
    permissions: ['view_assigned'],
  },
];

const generateMockAnalytics = (): AnalyticsData => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return {
    dailyActiveUsers: {
      current: Math.floor(Math.random() * 10000) + 5000,
      change: Math.floor(Math.random() * 20) - 10,
      data: last7Days.map(date => ({
        date,
        users: Math.floor(Math.random() * 5000) + 3000,
      })),
    },
    revenue: {
      current: Math.floor(Math.random() * 100000) + 50000,
      change: Math.floor(Math.random() * 30) - 15,
      data: last7Days.map(date => ({
        date,
        revenue: Math.floor(Math.random() * 50000) + 25000,
      })),
    },
    engagement: {
      current: Math.floor(Math.random() * 100) + 70,
      change: Math.floor(Math.random() * 10) - 5,
      data: last7Days.map(date => ({
        date,
        engagement: Math.floor(Math.random() * 30) + 70,
      })),
    },
  };
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const setTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // Auto-select first user for demo
      const user = users.find(u => u.tenantId === tenantId && u.role === 'admin');
      if (user) {
        setCurrentUser(user);
      }
    }
  };

  const setUser = (user: User) => {
    setCurrentUser(user);
  };

  const refreshAnalytics = () => {
    setAnalyticsData(generateMockAnalytics());
  };

  const updateTenantSettings = (settings: Partial<Tenant['settings']>) => {
    if (!currentTenant) return;
    
    const updatedTenants = tenants.map(tenant => 
      tenant.id === currentTenant.id 
        ? { ...tenant, settings: { ...tenant.settings, ...settings } }
        : tenant
    );
    
    setTenants(updatedTenants);
    setCurrentTenant(prev => prev ? { ...prev, settings: { ...prev.settings, ...settings } } : null);
    
    console.log('Tenant settings updated:', settings);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    
    setUsers(prev => [...prev, newUser]);
    console.log('User added:', newUser);
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    console.log('User removed:', userId);
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    console.log('User updated:', userId, userData);
  };

  useEffect(() => {
    // Simulate loading and set default tenant
    setTimeout(() => {
      setTenant('acme-corp');
      refreshAnalytics();
      setLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentTenant) {
        refreshAnalytics();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentTenant]);

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        currentUser,
        analyticsData,
        users: users.filter(u => u.tenantId === currentTenant?.id),
        loading,
        setTenant,
        setUser,
        refreshAnalytics,
        updateTenantSettings,
        addUser,
        removeUser,
        updateUser,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
