import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/user/home"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

