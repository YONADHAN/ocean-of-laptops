import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  siblingCount = 1, // Number of siblings to show on each side
}) => {
  if (totalPages <= 0) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers with dots
  const getPageNumbers = () => {
    const pages = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Always show first page
    pages.push(1);

    // Add left dots if needed
    if (shouldShowLeftDots) {
      pages.push('left-dots');
    } else if (currentPage > 3) {
      pages.push(2);
    }

    // Add sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add right dots if needed
    if (shouldShowRightDots) {
      pages.push('right-dots');
    } else if (currentPage < totalPages - 2) {
      pages.push(totalPages - 1);
    }

    // Always show last page
    if (totalPages !== 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4 flex items-center justify-between w-11/12 " >
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      
      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === 'left-dots' || pageNum === 'right-dots') {
            return (
              <span 
                key={`${pageNum}-${index}`} 
                className="w-8 h-8 flex items-center justify-center text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-8 rounded-full ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-blue-100'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;



























// Example usage with many pages
// const YourComponent = () => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = 1000;
  
//     return (
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//         siblingCount={1} // Optional: controls how many numbers show on each side
//       />
//     );
//   };