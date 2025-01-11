import React from 'react';

const Sidebar = ({ priceRange, onPriceRangeChange }) => {
  return (
    <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) })}
            className="w-20 border rounded px-2 py-1"
            min="0"
          />
          <span>to</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) })}
            className="w-20 border rounded px-2 py-1"
            min="0"
          />
        </div>
      </div>
      {/* Add more filter options here */}
    </aside>
  );
};

export default Sidebar;

