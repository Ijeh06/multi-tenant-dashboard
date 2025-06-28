
import React from 'react';
import { useTenant } from '../contexts/TenantContext';

const TenantSelector: React.FC = () => {
  const { currentTenant, setTenant } = useTenant();

  const tenants = [
    { id: 'Acme', name: 'Acme Corporation' },
    { id: 'tech-solutions', name: 'Tech Solutions Inc' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50 group">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
        <select
          value={currentTenant?.id || ''}
          onChange={(e) => setTenant(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
        >
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
      </div>
      {/* Hover trigger area - invisible but captures hover */}
      <div className="absolute inset-0 w-8 h-8 bg-transparent group-hover:bg-transparent"></div>
    </div>
  );
};

export default TenantSelector;
