import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-100'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;

