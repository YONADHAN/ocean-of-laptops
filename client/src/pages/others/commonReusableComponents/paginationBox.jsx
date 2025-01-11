import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate array of page numbers
  const getPageNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    return numbers;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="First page"
        >
          {'<<'}
        </button>
        
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${page === currentPage 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Last page"
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
};

export default Pagination;

