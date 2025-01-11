//navbar for the user section
import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingCart,
  X,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { axiosInstance } from "../../../../../api/axiosConfig";
const ModernNavbar = ({ isDarkMode, toggleTheme, toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // const token = Cookies.get("user_access_token");
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

      // Remove cookies
      // Cookies.remove("userRefreshToken");
      // Cookies.remove("user_access_token");
      Cookies.remove("RefreshToken");
      Cookies.remove("access_token");

      // Navigate to sign-in page
      navigate("/user/signin");
    } catch (error) {
      console.error(error);
      toast.error("Error during logout");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Shop", "Collections", "About"];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 h-[70px] flex-col ${
        scrolled
          ? isDarkMode
            ? "bg-gray-900/95 backdrop-blur-md"
            : "bg-blue-600/95 backdrop-blur-md shadow-lg"
          : isDarkMode
          ? "bg-gray-900"
          : "bg-blue-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 text-white">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-gray-900 hover:bg-blue-100"
              }`}
            >
              <Menu size={24} />
            </button>

            <a href="/user/home" className="ml-4 flex items-center space-x-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-white" : "bg-blue-100"
                }`}
              >
                <span
                  className={`font-bold text-xl ${
                    isDarkMode ? "text-white" : "text-blue-600"
                  }`}
                >
                  OL
                </span>
              </div>
              <span
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Oceon<span className="text-white">Of</span>Laptops
              </span>
            </a>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`/user/${link.toLowerCase()}`}
                className={`font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-100 hover:text-white"
                    : "text-gray-100 hover:text-gray-900"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-100 hover:bg-gray-800'
                  : 'text-gray-100 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            {/* <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-100 hover:bg-gray-800"
                  : "text-gray-100 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Search size={20} />
            </button> */}

            <a
              href="/user/features/account"
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-100 hover:bg-gray-800"
                  : "text-gray-100 hover:bg-gray-100  hover:text-gray-900"
              }`}
            >
              <User size={20} />
            </a>

            <a
              href="/user/features/wishlist"
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-100 hover:bg-gray-800"
                  : "text-gray-100 hover:bg-gray-100  hover:text-gray-900"
              }`}
            >
              <Heart size={24} />
            </a>

            <a
              href="/user/features/cart"
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-100 hover:bg-gray-800"
                  : "text-gray-100 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <ShoppingCart size={20} />        
           
            </a>

            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-100 hover:bg-gray-800"
                  : "text-gray-100 hover:bg-gray-100  hover:text-gray-900"
              }`}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden fixed inset-0 z-50 ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className={`mb-4 p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-100 hover:bg-gray-800"
                  : "text-gray-100 hover:bg-gray-100"
              }`}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`/user/${link.toLowerCase()}`}
                  className={`text-lg font-medium ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-2xl mx-4 p-6 rounded-xl shadow-xl ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className={`w-full px-4 py-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )} */}
    </nav>
  );
};

export default ModernNavbar;
