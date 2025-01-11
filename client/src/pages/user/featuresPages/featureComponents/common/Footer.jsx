import React from 'react';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`py-4 ${
      isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'
    }`}>
      <div className="container mx-auto text-center">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

