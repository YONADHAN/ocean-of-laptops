import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, percentage, trend, icon: Icon, color }) => {
  const isPositive = percentage > 0;
  
  const bgColors = {
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-rose-500',
    orange: 'bg-orange-500'
  };

  const lightBgColors = {
    green: 'bg-emerald-50',
    blue: 'bg-blue-50',
    red: 'bg-rose-50',
    orange: 'bg-orange-50'
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className={`${lightBgColors[color]} p-2 rounded-lg`}>
          <Icon className={`h-5 w-5 ${bgColors[color]} text-white rounded p-1`} />
        </div>
        <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {Math.abs(percentage)}%
        </span>
      </div>
      <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      <p className="text-2xl font-semibold mt-1">${value}</p>
    </div>
  );
};

export default StatCard;

