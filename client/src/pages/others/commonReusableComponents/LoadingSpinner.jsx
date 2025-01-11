import React from 'react';

const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const colorClasses = {
    blue: "border-blue-600",
    red: "border-red-600",
    green: "border-green-600",
    yellow: "border-yellow-600",
    purple: "border-purple-600",
    gray: "border-gray-600"
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default LoadingSpinner;