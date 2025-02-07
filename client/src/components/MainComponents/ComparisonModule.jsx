import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {axiosInstance }from '../../api/axiosConfig'

const ProductComparison = () => {
  const [activeTab, setActiveTab] = useState('product1');
  const [laptop1Name, setLaptop1Name] = useState("");
  const [laptop2Name, setLaptop2Name] = useState("");
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [selectedLaptops, setSelectedLaptops] = useState({
    laptop1: null,
    laptop2: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimeout = useRef(null);

  const laptopDatabase = [
    {
      productName: "MacBook Pro M3",
      brand: "Apple",
      modelNumber: "MBP2024",
      processor: { brand: "Apple", model: "M3 Pro", generation: "3rd" },
      ram: { size: "32GB", type: "Unified" },
      storage: { type: "SSD", capacity: "1TB" },
      graphics: { model: "M3 Pro GPU", vram: "16-core" },
      display: { size: "16.2", resolution: "3456 x 2234", refreshRate: "120Hz" },
      operatingSystem: "macOS",
      batteryLife: "22",
      weight: "2.2",
      salePrice: 199900
    },
    {
      productName: "Dell XPS 15",
      brand: "Dell",
      modelNumber: "XPS 9520",
      processor: { brand: "Intel", model: "Core i9", generation: "13th" },
      ram: { size: "32GB", type: "DDR5" },
      storage: { type: "SSD", capacity: "2TB" },
      graphics: { model: "NVIDIA RTX 4070", vram: "8GB" },
      display: { size: "15.6", resolution: "3840 x 2400", refreshRate: "60Hz" },
      operatingSystem: "Windows 11",
      batteryLife: "12",
      weight: "1.8",
      salePrice: 189900
    }
  ];

  const handleCloseComparisonModule = async (req, res) => {
    setSelectedLaptops(
      {
        laptop1: null,
        laptop2: null
      }
    )
    setLaptop1Name("")
    setLaptop2Name("")
  }

  const fetchSuggestions = async (searchTerm, setSuggestions) => {
    try {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      const response = await axiosInstance.get(`/search?term=${searchTerm}`);
      setSuggestions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleLaptop1Search = (value) => {
    setLaptop1Name(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value, setSuggestions1);
    }, 300);
  };

  const handleLaptop2Search = (value) => {
    setLaptop2Name(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value, setSuggestions2);
    }, 300);
  };

  const handleSelectSuggestion = (product, isFirstLaptop) => {
    if (isFirstLaptop) {
      setLaptop1Name(product.productName);
      setSuggestions1([]);
      setSelectedLaptops(prev => ({
        ...prev,
        laptop1: product
      }));
    } else {
      setLaptop2Name(product.productName);
      setSuggestions2([]);
      setSelectedLaptops(prev => ({
        ...prev,
        laptop2: product
      }));
    }
  };

  // Function to render comparison row
  const ComparisonRow = ({ label, value1, value2 }) => (
    <div className="grid grid-cols-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="px-4 py-3 font-medium text-gray-900">{label}</div>
      <div className="px-4 py-3 text-gray-600">{value1}</div>
      <div className="px-4 py-3 text-gray-600">{value2}</div>
    </div>
  );

  // Mobile card view for a single product
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="border-b border-gray-200 pb-3 mb-4">
        <h3 className="text-lg font-semibold">{product.productName}</h3>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Brand</div>
          <div className="text-sm">{product.brand}</div>
          
          <div className="text-sm font-medium">Processor</div>
          <div className="text-sm">{product.processor.model}</div>
          
          <div className="text-sm font-medium">RAM</div>
          <div className="text-sm">{product.ram.size}</div>
          
          <div className="text-sm font-medium">Storage</div>
          <div className="text-sm">{product.storage.capacity}</div>
          
          <div className="text-sm font-medium">Graphics</div>
          <div className="text-sm">{product.graphics.model}</div>
          
          <div className="text-sm font-medium">Display</div>
          <div className="text-sm">{product.display.size}" - {product.display.resolution}</div>
          
          <div className="text-sm font-medium">OS</div>
          <div className="text-sm">{product.operatingSystem}</div>
          
          <div className="text-sm font-medium">Battery Life</div>
          <div className="text-sm">{product.batteryLife} hrs</div>
          
          <div className="text-sm font-medium">Weight</div>
          <div className="text-sm">{product.weight} kg</div>
          
          <div className="text-sm font-medium">Price</div>
          <div className="text-sm">₹{product.salePrice.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );

  const ComparisonContent = ({ laptop1, laptop2 }) => (
    <>
      {/* Mobile View (< 768px) */}
      <div className="block md:hidden">      
        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'product1'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('product1')}
          >
            {laptop1.productName}
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'product2'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('product2')}
          >
            {laptop2.productName}
          </button>
        </div>
        <div>
          {activeTab === 'product1' && <ProductCard product={laptop1} />}
          {activeTab === 'product2' && <ProductCard product={laptop2} />}
        </div>
        <div className="p-1 bg-gray-200" onClick={handleCloseComparisonModule}>close</div>
      </div>

      {/* Tablet/Desktop View (≥ 768px) */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 flex justify-between">
            <h2 className="text-2xl font-bold">Product Comparison</h2>
            <div className="p-1 bg-gray-200" onClick={handleCloseComparisonModule}>close</div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 border-b-2 border-gray-200 pb-2 mb-2">
              <div className="px-4 py-2 font-bold">Feature</div>
              <div className="px-4 py-2 font-bold">{laptop1.productName}</div>
              <div className="px-4 py-2 font-bold">{laptop2.productName}</div>
            </div>
            
            <ComparisonRow label="Brand" value1={laptop1.brand} value2={laptop2.brand} />
            <ComparisonRow label="Processor" value1={laptop1.processor.model} value2={laptop2.processor.model} />
            <ComparisonRow label="RAM" value1={laptop1.ram.size} value2={laptop2.ram.size} />
            <ComparisonRow label="Storage" value1={laptop1.storage.capacity} value2={laptop2.storage.capacity} />
            <ComparisonRow label="Graphics" value1={laptop1.graphics.model} value2={laptop2.graphics.model} />
            <ComparisonRow 
              label="Display" 
              value1={`${laptop1.display.size}" - ${laptop1.display.resolution}`}
              value2={`${laptop2.display.size}" - ${laptop2.display.resolution}`}
            />
            <ComparisonRow label="OS" value1={laptop1.operatingSystem} value2={laptop2.operatingSystem} />
            <ComparisonRow 
              label="Battery Life" 
              value1={`${laptop1.batteryLife} hrs`}
              value2={`${laptop2.batteryLife} hrs`}
            />
            <ComparisonRow 
              label="Weight" 
              value1={`${laptop1.weight} kg`}
              value2={`${laptop2.weight} kg`}
            />
            <ComparisonRow 
              label="Price" 
              value1={`₹${laptop1.salePrice.toLocaleString()}`}
              value2={`₹${laptop2.salePrice.toLocaleString()}`}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-200">
      <div className="text-2xl text-blue-500 my-3">Choose the most suitable one </div>
      {/* Search Section */}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
        {/* First Laptop Search */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Enter first laptop name"
            className="w-full p-2 border rounded"
            value={laptop1Name}
            onChange={(e) => handleLaptop1Search(e.target.value)}
          />
          {Array.isArray(suggestions1) && suggestions1.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {suggestions1.map((product) => (
                <div
                  key={product._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(product, true)}
                >
                  {product.productName} - {product.brand}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Second Laptop Search */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Enter second laptop name"
            className="w-full p-2 border rounded"
            value={laptop2Name}
            onChange={(e) => handleLaptop2Search(e.target.value)}
          />
          {Array.isArray(suggestions2) && suggestions2.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {suggestions2.map((product) => (
                <div
                  key={product._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(product, false)}
                >
                  {product.productName} - {product.brand}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (selectedLaptops.laptop1 && selectedLaptops.laptop2) {
              setActiveTab('product1');
            } else {
              setError("Please select both laptops to compare");
            }
          }}
          className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={!selectedLaptops.laptop1 || !selectedLaptops.laptop2}
        >
          Compare
        </button>
        
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
          Loading suggestions...
        </div>
      )}

      {/* Comparison Section */}
      {selectedLaptops.laptop1 && selectedLaptops.laptop2 && (
        <ComparisonContent
          laptop1={selectedLaptops.laptop1}
          laptop2={selectedLaptops.laptop2}
        />
      )}
    </div>
  );
};

export default ProductComparison;