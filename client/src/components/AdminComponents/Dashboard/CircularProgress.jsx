import React from 'react';

const CircularProgress = ({ value, label, color }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  
  const strokeColors = {
    blue: 'stroke-blue-500',
    orange: 'stroke-orange-500'
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            className="stroke-gray-200"
            strokeWidth="5"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            className={strokeColors[color]}
            strokeWidth="5"
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
          {value}%
        </span>
      </div>
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="text-sm text-gray-500">This month</p>
      </div>
    </div>
  );
};

export default CircularProgress;

