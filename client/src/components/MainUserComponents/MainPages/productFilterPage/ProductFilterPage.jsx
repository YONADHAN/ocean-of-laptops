
import React, { useState, useCallback } from "react";
import ProductFilter from "./components/Filters";
import ProductList from "./components/productList";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "../../../../hooks/customDebounceHook"; 

const App = () => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price:asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
 
  const debouncedSearch = useDebounce((value) => {
    setCurrentPage(1);
    //console.log("Search query submitted:", value);
  }, 800);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const renderSearchBar = () => {
    return (
      <div className="relative flex items-center border rounded-md lg:w-[400px]">
        <input
          type="text"
          onChange={handleSearchChange}
          value={searchQuery}
          className="w-full p-2 border-none outline-none rounded-l-md"
          placeholder="Search for products..."
        />
        <span className="bg-white p-3 rounded-r-md">
          <FaSearch className="text-gray-400" />
        </span>
      </div>
    );
  };

  const renderSortOptions = () => (
    <div className="mb-0 flex place-items-center gap-2 bg-gray-200 pl-2 ">
      <label className="block text-md font-medium mb-2">Sort By:</label>
      <select
        value={sort}
        onChange={handleSortChange}
        className="block  p-2 border border-none  focus:outline-none"
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

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Product List */}
        <div className="flex-1">
          <div className="w-full flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>{renderSearchBar()}</div>
            {renderSortOptions()}
          </div>
          <ProductList 
            filters={filters} 
            sort={sort} 
            searchQuery={searchQuery}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default App;


