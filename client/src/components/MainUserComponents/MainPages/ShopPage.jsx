
// // export default App;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import ProductCard from "../../UserComponents/products/productCardModel";
// import {axiosInstance} from '../../../api/axiosConfig'
// const ShoppingPage = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(
//         `/get_all_products_paginated?page=${currentPage}&limit=9`
//       );

//       if (response.data.success) {
//         if (currentPage === 1) {
//           setProducts(response.data.products);
//         } else {
//           setProducts((prev) => [...prev, ...response.data.products]);
//         }
//         setTotalPages(response.data.totalPages);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 1; i <= 5; i++) {
//       if (i <= fullStars) {
//         stars.push(<FaStar key={i} className="text-yellow-400" />);
//       } else if (i === fullStars + 1 && hasHalfStar) {
//         stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
//       } else {
//         stars.push(<FaRegStar key={i} className="text-yellow-400" />);
//       }
//     }
//     return stars;
//   };

//   const goToProductDetailsPage = (productId) => {
//     navigate(`/user/product_detail/${productId}`);
//   };

//   const loadMore = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage]);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-center mb-8">Shopping Page</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 px-20">
//         {products.map((product) => (
//           <ProductCard
//             key={product._id}
//             product={product}
//             onProductClick={goToProductDetailsPage}
//           />
//         ))}
//       </div>

//       {currentPage < totalPages && (
//         <div className="text-center mt-8">
//           <button
//             onClick={loadMore}
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
//           >
//             {loading ? "Loading..." : "Load More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShoppingPage;

import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import axios from 'axios';

const ProductFilter = ({ onFilterChange }) => {
  // State for filter management
  const [filterOptions, setFilterOptions] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const normalizeData = (data) => {
    const uniqueAndFormatted = (arr) =>
      Array.from(new Set(arr.map((item) => item.trim().toLowerCase())))
        .map((item) => item.replace(/\b\w/g, (char) => char.toUpperCase()));
  
    return {
      ...data,
      processorBrands: uniqueAndFormatted(data.processorBrands || []),
      processorModels: uniqueAndFormatted(data.processorModels || []),
      // Repeat for other fields...
      categories: (data.categories || []).map((cat) => ({
        ...cat,
        name: cat.name.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
      }))
    };
  };
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/get_filter_options');
        setFilterOptions(normalizeData(response.data));
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
  
    fetchFilterOptions();
  }, []);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle individual filter selection
  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          [value]: !(prev[category]?.[value] || false)
        }
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  // Handle price range change
  const handlePriceChange = (value) => {
    setPriceRange(value);
    const newFilters = { 
      ...selectedFilters, 
      priceRange: value 
    };
    onFilterChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({});
    setPriceRange([0, 2000]);
    onFilterChange({});
  };

  // Render filter category
  const renderFilterCategory = (category, options) => {
    if (!options || options.length === 0) return null;

    const categoryOptions = options.map(option => 
      typeof option === 'object' && option !== null ? option.name || option._id : option
    );

    return (
      <div key={category} className="mb-4 border-b pb-4">
        <button
          onClick={() => toggleCategory(category)}
          className="flex items-center justify-between w-full text-left font-medium p-2 hover:bg-gray-50 rounded"
        >
          {category}
          {expandedCategories[category] ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedCategories[category] && (
          <div className="mt-2 pl-2 max-h-48 overflow-y-auto">
            {categoryOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedFilters[category]?.[option] || false}
                  onChange={() => handleFilterChange(category, option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main filter content
  const filterContent = (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiFilter className="mr-2" /> Filters
      </h2>
      
      {/* Price Range Slider */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Price Range</h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
            className="w-20 p-2 border rounded-md"
            min="0"
            max="2000"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-20 p-2 border rounded-md"
            min="0"
            max="2000"
          />
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          value={priceRange[1]}
          onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
        />
      </div>

      {/* Dynamic Filter Categories */}
      {Object.entries(filterOptions).map(([category, options]) => 
        renderFilterCategory(category, options)
      )}

      <div className="flex space-x-2">
        <button
          onClick={clearFilters}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={() => onFilterChange(selectedFilters)}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Responsive filter component
  return (
    <>
      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        <FiFilter />
      </button>

      {/* Desktop Filter */}
      <div className="hidden md:block w-64 lg:w-72">
        {filterContent}
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              ✕
            </button>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilter;