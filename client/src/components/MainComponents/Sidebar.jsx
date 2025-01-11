import React from "react";
import { Link } from "react-router-dom";
import { X, LogOut, Laptop } from "lucide-react";

const Sidebar = ({ isVisible, onClose, role, handleLogout, navItems }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isVisible ? "bg-black bg-opacity-50" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute top-0 left-0 h-full w-full sm:w-64 transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-gray-900 shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Laptop className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Ocean<span className="text-blue-500">Of</span>Laptops
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-blue-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 mt-4 px-3 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.url}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>

          {role !== "public" && (
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
