// Footer.jsx
import React, { useState } from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-blue-100 dark:bg-blue-900 pt-8 pb-4">
      {/* Newsletter Section */}
      <div className="bg-blue-500 dark:bg-blue-800 py-6 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h3>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-4 py-2 border outline-none rounded-md flex-grow md:w-80 border-blue-300 text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-700"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Description */}
          <div className="lg:col-span-1">
            <p className="text-blue-900 dark:text-blue-100 mb-4">
              The customer is at the heart of our unique business model, which includes design
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

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-blue-900 dark:text-blue-100">COMPANY</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">About</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Features</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Works</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Career</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold mb-4 text-blue-900 dark:text-blue-100">HELP</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Customer Support</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Delivery Details</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Terms & Conditions</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Privacy Policy</a></li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div>
            <h4 className="font-semibold mb-4 text-blue-900 dark:text-blue-100">FAQ</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Account</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Manage Deliveries</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Orders</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Payments</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4 text-blue-900 dark:text-blue-100">RESOURCES</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Free eBooks</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Development Tutorial</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">How to - Blog</a></li>
              <li><a href="#" className="text-blue-900 hover:text-blue-700 dark:text-blue-100 dark:hover:text-blue-300">Youtube Playlist</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-300 dark:border-blue-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-900 dark:text-blue-100 text-sm">
            Shop.co © 2020-2023, All Rights Reserved
          </p>
          <div className="flex gap-4">
            <img src="/visa.png" alt="Visa" className="h-6" />
            <img src="/mastercard.png" alt="Mastercard" className="h-6" />
            <img src="/paypal.png" alt="PayPal" className="h-6" />
            <img src="/applepay.png" alt="Apple Pay" className="h-6" />
            <img src="/googlepay.png" alt="Google Pay" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
