import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, Sun, Moon, Laptop, LogOut } from 'lucide-react';
import { jwtDecode as jwt_decode } from "jwt-decode";
import Cookies from 'js-cookie'
import {toast} from 'sonner'
import {axiosInstance} from '../../api/axiosConfig'
const Header = ({ role, toggleSidebar, toggleTheme, isAuthenticated, userAvatar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  
  const handleLogout = async() => {
    try {
      // const token = Cookies.get("admin_access_token");
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Token not found");
        return;
      }
  
      const decoded = jwt_decode(token);
   
      if (!decoded || !decoded._id) {
        toast.error("Invalid token");
        return;
      }
  
      const id = decoded._id;
      const deleted = await axiosInstance.delete(`/auth/refresh-token/${id}`);
   
      if (!deleted || deleted.status !== 200) {
        toast.error("Unsuccessful logout!");
        return;
      }
     
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      document.cookie = "RefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  
      // // Remove cookies
      // Cookies.remove("userRefreshToken");
      // Cookies.remove("user_access_token");

      window.location.href = '/admin/signin';
      // // Navigate to sign-in page
      // navigate("/admin/signin");
      console.log('Logging out...');
    } catch (error) {
      console.error(error);
      toast.error("Error in logout");
    }
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center ml-4">
              <Laptop className="h-8 w-8 text-blue-500" />
              <Link to="/" className="flex items-center ml-2">
                <span className="text-2xl font-bold">
                  Ocean<span className="text-blue-500">Of</span>Laptops
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* <button className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>
              <Bell className="h-5 w-5" />
            </button> */}

            {/* <button
              onClick={handleThemeToggle}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className={`w-5 h-5 rounded-full transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-6 bg-white' : 'translate-x-0 bg-blue-500'}`}>
                {isDarkMode ? (
                  <Moon className="h-3 w-3 text-blue-600" />
                ) : (
                  <Sun className="h-3 w-3 text-white" />
                )}
              </div>
            </button> */}

            {/* <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center bg-blue-600 rounded-full overflow-hidden">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      className="w-8 h-8 hover:scale-110 transition-transform duration-200 rounded-full"
                    />
                  ) : (
                    <User className={`h-6 w-6 m-1 ${isDarkMode ? 'text-white' : 'text-gray-300'}`} />
                  )}
                </div>
              ) : (
                <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium">
                  Sign Up
                </Link>
              )}
            </div> */}

            <button onClick={handleLogout} className='text-gray-500'>
              <LogOut />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

