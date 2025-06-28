
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalyticsWidgetProps {
  title: string;
  value: number;
  change: number;
  data: Array<{ date: string; [key: string]: any }>;
  dataKey: string;
  format?: (value: number) => string;
  color?: string;
  clickable?: boolean;
  metricType?: 'revenue' | 'users' | 'engagement';
}

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({
  title,
  value,
  change,
  data,
  dataKey,
  format = (v) => v.toLocaleString(),
  color = '#3B82F6',
  clickable = true,
  metricType,
}) => {
  const navigate = useNavigate();
  const isPositive = change >= 0;

  const handleClick = () => {
    if (clickable && metricType) {
      navigate(`/analytics/${metricType}`);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 transition-all duration-200 ${
        clickable ? 'cursor-pointer hover:shadow-md hover:border-blue-300 group' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
          {clickable && (
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900">
          {format(value)}
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis hide />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: number) => [format(value), title]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
