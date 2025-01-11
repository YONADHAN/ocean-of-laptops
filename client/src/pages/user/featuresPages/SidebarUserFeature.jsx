import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, navItems, isDarkMode }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center px-4 py-[21px] border-b dark:border-slate-700 bg-blue-600 ">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white ' : 'text-gray-800 '}`}> Oceon<span className='text-white'>Of</span>Laptops</h2>
        <button onClick={onClose} className={`${isDarkMode ? 'text-white' : 'text-gray-600'} hover:text-gray-800`}>
          <X size={24}  />
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.title} className="mb-2">
              <Link
                to={item.url}
                className={`flex items-center px-4 py-2 ${
                  isDarkMode
                    ? 'text-gray-100 hover:bg-gray-700'
                    : 'hover:text-gray-100 hover:bg-blue-600'
                }`}
                onClick={onClose}
              >
                <item.icon className="mr-2" size={20} />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

