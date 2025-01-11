import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";
import axios from "axios";
import {axiosInstance} from '../../../../../api/axiosConfig';
import {productService} from '../../../../../apiServices/userApiServices'
const ProductFilter = ({ onFilterChange }) => {
  const [filterOptions, setFilterOptions] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("createdAt:desc");

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // const response = await axiosInstance.get(
        //   "/get_filter_options"
        // );
        const response = await productService.getFilterOptions();
        setFilterOptions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);



  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSelectedSort(selectedSort);
    onSortChange(selectedSort); // Notify parent component
  };

  const renderSortOptions = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Sort By:</label>
      <select
        value={selectedSort}
        onChange={handleSortChange}
        className="block w-[290px] p-2 border rounded-md"
      >
        <option value="price:asc">Price: Low to High</option>
        <option value="price:desc">Price: High to Low</option>
        <option value="rating:desc">Average Ratings</option>
        <option value="createdAt:desc">New Arrivals</option>
        <option value="name:asc">A-Z</option>
        <option value="name:desc">Z-A</option>
      </select>
    </div>
  );


  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          [value]: !(prev[category]?.[value] || false)
        }
      };
      return newFilters; // Don't trigger onFilterChange yet
    });
  };
  
  const applyFilters = () => {
    const nonEmptyFilters = Object.keys(selectedFilters).reduce((acc, key) => {
      if (Object.values(selectedFilters[key]).some(val => val)) {
        acc[key] = selectedFilters[key];
      }
      return acc;
    }, {});
  
    // Ensure minPrice and maxPrice are sent correctly as separate parameters
    if (priceRange) {
      nonEmptyFilters.minPrice = priceRange[0];
      nonEmptyFilters.maxPrice = priceRange[1];
    }
  
    onFilterChange(nonEmptyFilters); // Send to backend
  };
  
  

  const handlePriceChange = (value) => {
    setPriceRange(value);
  
    // Update filters separately for minPrice and maxPrice
    const newFilters = {
      ...selectedFilters,
      minPrice: value[0],
      maxPrice: value[1],
    };
    onFilterChange(newFilters); // Send the updated filters to App component
  };
  
  

  const clearFilters = () => {
    setSelectedFilters({});
    setPriceRange([0, 500000]);
    onFilterChange({}); // Clear filters in the parent component
  };

  const renderFilterCategory = (category, options) => {
    if (!options || options.length === 0) return null;

    const categoryOptions = options.map((option) =>
      typeof option === "object" && option !== null
        ? option.name || option._id
        : option
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
            onChange={(e) =>
              handlePriceChange([parseInt(e.target.value), priceRange[1]])
            }
            className="w-20 p-2 border rounded-md"
            min="0"
            max="500000"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              handlePriceChange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-20 p-2 border rounded-md"
            min="0"
            max="500000"
          />
        </div>
        <input
          type="range"
          min="0"
          max="500000"
          value={priceRange[1]}
          onChange={(e) =>
            handlePriceChange([priceRange[0], parseInt(e.target.value)])
          }
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
          onClick={applyFilters}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        <FiFilter />
      </button>

      <div className="hidden md:block w-64 lg:w-72">{filterContent}</div>

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
