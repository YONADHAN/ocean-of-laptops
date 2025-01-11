import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function SimpleNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blue-700/90 text-white shadow-lg backdrop-blur-lg"
          : "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Navigation Container */}
        <div className="flex justify-between items-center h-16">
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
            <a href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 border-white border-2">
                <span className="font-bold text-lg text-white">OL</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                Ocean of Laptops
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
         
            <a
              href="/user/home"
              className="font-medium text-white hover:text-teal-200 transition-colors"
            >
              Home
            </a>
            <a
              href="/user/shop"
              className="font-medium text-white hover:text-teal-200 transition-colors"
            >
              Shop
            </a>
            <a
              href="/user/collections"
              className="font-medium text-white hover:text-teal-200 transition-colors"
            >
              Collections
            </a>
            <a
              href="/about"
              className="font-medium text-white hover:text-teal-200 transition-colors"
            >
              About
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
                href={`/${link.toLowerCase()}`}
                key={link}
                className="text-lg text-white hover:text-teal-200 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SimpleNavbar;
