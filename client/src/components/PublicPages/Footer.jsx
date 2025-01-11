import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-100 dark:bg-blue-900 pt-6 pb-4">
      <div className="container mx-auto px-4">
        {/* Top Section: Company Description and Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <p className="text-blue-900 dark:text-blue-100 text-center md:text-left">
            Building a better shopping experience with top-notch services and products.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">
              <FaGithub size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-wrap justify-center md:justify-between gap-4 text-blue-900 dark:text-blue-100">
          <a href="#" className="hover:text-blue-700 dark:hover:text-blue-300">Home</a>
          <a href="#" className="hover:text-blue-700 dark:hover:text-blue-300">Shop</a>
          <a href="#" className="hover:text-blue-700 dark:hover:text-blue-300">About Us</a>
          <a href="#" className="hover:text-blue-700 dark:hover:text-blue-300">Contact</a>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-300 dark:border-blue-700 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-900 dark:text-blue-100 text-sm text-center md:text-left">
            Shop.co © 2023, All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
