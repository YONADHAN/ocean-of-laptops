import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Home, Users, Settings, Tag, User, ShoppingCart,  Image, Gift, Sliders, Heart, Wallet, History, ShoppingBagIcon, ShoppingBasket, UsbIcon } from 'lucide-react';
import {  RiAccountCircleLine, RiCoupon3Line } from "react-icons/ri";
import ModernNavbar from './featuresPages/featureComponents/common/Navbar';
import Sidebar from '../user/featuresPages/SidebarUserFeature';
import Footer from './featuresPages/featureComponents/common/Footer';


const UserFeatureLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    
    { title: 'Home', url: '/', icon: Home },
    { title: 'Shopping', url: '/shop', icon: ShoppingBagIcon},
    { title: 'Collections',url: '/collections', icon: ShoppingBasket},      
    { title: 'Cart', url: '/user/features/cart', icon: ShoppingCart },
    { title: 'Order', url: '/user/features/order', icon: History },    
    { title: 'Wishlist', url: '/user/features/wishlist', icon: Heart },
    { title: 'Wallet', url: '/user/features/wallet', icon: Wallet },
    { title: 'About Us', url: '/about', icon:  Users},
    { title: 'Account', url: '/user/features/account', icon: RiAccountCircleLine },
  
    // { title: 'Contact Us', url: '/user/features/contact_us', icon: Gift },
    // { title: 'Settings', url: '/user/features/settings', icon: Sliders },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <ModernNavbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-grow">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          navItems={navItems}
          isDarkMode={isDarkMode}
        />
        <main className={`flex-grow pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
          isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="max-w-7xl mx-auto py-3">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default UserFeatureLayout;

