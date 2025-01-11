//navbar for the features

import React, { useState, useEffect } from "react";
import { Menu, Search, User, Heart, ShoppingCart, X } from "lucide-react";
import { Sun, Moon, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axiosConfig";
import { toast } from "sonner";
import { jwtDecode as jwt_decode } from "jwt-decode";
function ModernNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };
  const logoutlogic = async () => {
    try {
      const token = Cookies.get("user_access_token");
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
      Cookies.remove("userRefreshToken");
      Cookies.remove("user_access_token");

      // Navigate to sign-in page
      navigate("/user/signin");
    } catch (error) {
      console.error(error);
      toast.error("Error in logout");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 mb-8 ${
        scrolled
          ? isDarkMode
            ? "bg-slate-800/90 text-white shadow-lg backdrop-blur-lg"
            : "bg-blue-700/90 text-white shadow-lg backdrop-blur-lg"
          : isDarkMode
          ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Navigation Container */}
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-300 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/user/home" className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-500"
                    : "bg-white/20 border-white"
                }`}
              >
                <span className="font-bold text-xl text-white">OL</span>
              </div>
              <span
                className={`ml-3 text-2xl font-bold flex items-center ${
                  isDarkMode ? "text-slate-300" : "text-white"
                }`}
              >
                Oceon
                <p
                  className={`${
                    isDarkMode ? "text-slate-500" : "text-blue-900"
                  } font-extrabold`}
                >
                  Of
                </p>
                Laptops
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Shop", "Collections", "About"].map((link) => (
              <a
                href={`/user/${link.toLowerCase()}`}
                key={link}
                className={`font-medium transition-colors ${
                  isDarkMode
                    ? "text-slate-300 hover:text-blue-400"
                    : "text-white hover:text-teal-200"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={handleThemeToggle}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${
                isDarkMode ? "bg-slate-500" : "bg-blue-100"
              }`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <div
                className={`w-5 h-5 rounded-full transform duration-300 flex items-center justify-center ${
                  isDarkMode
                    ? "translate-x-6 bg-white"
                    : "translate-x-0 bg-blue-500"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="h-3 w-3 text-blue-600" />
                ) : (
                  <Sun className="h-3 w-3 text-white" />
                )}
              </div>
            </button> */}

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:text-blue-400"
                  : "text-white hover:text-teal-200"
              }`}
            >
              <Search size={20} />
            </button>

            <a
              href="/user/features/account"
              className={`transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:text-blue-400"
                  : "text-white hover:text-teal-200 "
              }`}
            >
              <User size={20} />
            </a>

            <a
              href="/user/features/wishlist"
              className={`transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:text-blue-400"
                  : "text-white hover:text-teal-200"
              }`}
            >
              <Heart size={20} />
            </a>

            <a
              href="/user/features/cart"
              className={`relative transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:text-blue-400"
                  : "text-white hover:text-teal-200"
              }`}
            >
              <ShoppingCart size={20} />
              {/* <span
                className={`absolute -top-2 -right-2 h-4 w-4 text-xs rounded-full flex items-center justify-center ${
                  isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                3
              </span> */}
            </a>

            <a
              onClick={logoutlogic}
              className={`relative transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:text-blue-400"
                  : "text-white hover:text-teal-200"
              }`}
            >
              <LogOut size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } bg-blue-700/95 z-40 pt-20 px-6`}
        >
          <div className="flex flex-col space-y-6">
            {["Home", "Shop", "Collections", "About"].map((link) => (
              <a
                href={`/user/${link.toLowerCase()}`}
                key={link}
                className="text-xl text-white hover:text-teal-200 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-blue-50 dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, collections..."
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-500 text-slate-300 focus:ring-blue-400"
                      : "bg-blue-50 border-blue-500 text-blue-600 focus:ring-blue-300"
                  }`}
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isDarkMode
                      ? "text-slate-300 hover:text-blue-400"
                      : "text-blue-500 hover:text-blue-700"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ModernNavbar;
