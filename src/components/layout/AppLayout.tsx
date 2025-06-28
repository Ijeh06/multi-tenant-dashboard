
import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import TenantSelector from '../TenantSelector';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <TenantSelector />
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
