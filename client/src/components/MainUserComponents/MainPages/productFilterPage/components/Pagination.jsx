import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center space-x-2">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded-md ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;

