
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: {
    primaryColor: string;
    logo?: string;
    timezone: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  tenantId: string;
  permissions: string[];
  department?: string;
}

export interface AnalyticsData {
  dailyActiveUsers: {
    current: number;
    change: number;
    data: Array<{ date: string; users: number }>;
  };
  revenue: {
    current: number;
    change: number;
    data: Array<{ date: string; revenue: number }>;
  };
  engagement: {
    current: number;
    change: number;
    data: Array<{ date: string; engagement: number }>;
  };
}
