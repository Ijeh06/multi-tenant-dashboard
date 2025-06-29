
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  tenantId: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@acmecorp.com',
    name: 'Admin User',
    role: 'admin',
    tenantId: 'acme-corp',
    permissions: ['view_all', 'edit_all', 'manage_users', 'manage_settings']
  },
  {
    id: '2',
    email: 'manager@acmecorp.com',
    name: 'Manager User',
    role: 'manager',
    tenantId: 'acme-corp',
    permissions: ['view_department', 'edit_department', 'manage_team']
  },
  {
    id: '3',
    email: 'viewer@acmecorp.com',
    name: 'Viewer User',
    role: 'viewer',
    tenantId: 'acme-corp',
    permissions: ['view_assigned']
  },
  {
    id: '4',
    email: 'admin@techstart.com',
    name: 'Tech Admin',
    role: 'admin',
    tenantId: 'tech-solutions',
    permissions: ['view_all', 'edit_all', 'manage_users', 'manage_settings']
  },
  {
    id: '5',
    email: 'manager@techstart.com',
    name: 'Tech Manager',
    role: 'manager',
    tenantId: 'tech-solutions',
    permissions: ['view_department', 'edit_department', 'manage_team']
  },
  {
    id: '6',
    email: 'viewer@globalsol.com',
    name: 'Global Viewer',
    role: 'viewer',
    tenantId: 'tech-solutions',
    permissions: ['view_assigned']
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Find user by email and validate password (demo password is 'demo123')
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      return true;
    }
    
    throw new Error('Invalid email or password');
  };

  const signOut = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
