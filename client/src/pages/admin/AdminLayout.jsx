import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Home, Users, Settings, Tag, User, ShoppingCart,PackageSearch, Image, Gift, Sliders, ClipboardList ,ListOrdered} from 'lucide-react';
import Header from '../../components/MainComponents/Header';
import Sidebar from '../../components/MainComponents/Sidebar';
import Footer from '../../components/MainComponents/Footer';
import { jwtDecode as jwt_decode } from "jwt-decode";
import Cookies from 'js-cookie'
import {toast} from 'sonner'
import {axiosInstance} from '../../api/axiosConfig'
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);  

  const role = "admin";
  const isAuthenticated = true; 
  const userAvatar = null; 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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

  const navItems = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
    {title:'Sales Report', url:'/admin/sales_report', icon: ClipboardList},
    { title: 'Category', url: '/admin/category', icon: Tag },
    { title: 'Products', url: '/admin/products', icon: PackageSearch },  
    { title: 'Customers', url: '/admin/customers', icon: Users },
    { title: 'Orders', url: '/admin/orders', icon: ListOrdered },
    { title: 'Banner', url: '/admin/banner', icon: Image },
    { title: 'Coupon', url: '/admin/coupon', icon: Gift },
    { title: 'Settings', url: '/admin/settings', icon: Sliders },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''} `}>
      <Header
        role={role}
        toggleSidebar={toggleSidebar}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        userAvatar={userAvatar}
      />
      <Sidebar
        isVisible={isSidebarOpen}
        onClose={toggleSidebar}
        role={role}
        handleLogout={handleLogout}
        navItems={navItems}
      />
      <main className="flex-grow pt-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-blue-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6">
          <Outlet />
        </div>
      </main>
      <Footer role={role} />
    </div>
  );
};

export default AdminLayout;

