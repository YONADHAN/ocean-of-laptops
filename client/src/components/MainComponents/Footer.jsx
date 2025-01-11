import React from 'react';

const Footer = ({ role }) => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-4 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2023 OceanOfLaptops. All rights reserved.</p>
        {role === 'admin' && (
          <p className="text-sm mt-2 text-blue-500 dark:text-blue-400">
            Admin Panel
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;

