


// import React, { useState, useEffect } from "react";

// const App = () => {
//     const [availableOptions, setAvailableOptions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedOptions, setSelectedOptions] = useState({});

//     useEffect(() => {
//         fetchList();
//     }, []);

//     const fetchList = () => {
//         setLoading(true);
//         const list = [
//             ["Brand", "brand", ["Acer", "Apple", "Asus", "Dell", "HP", "Lenovo"]],
//             ["Model Number", "modelNumber", ["614JV-N3474WS", "A2779", "A92U2PT"]],
//             ["Processor Brand", "processor.brand", ["AMD", "Apple", "Intel"]],
//             ["Processor Model", "processor.model", ["Core i3", "Core i5", "Core i7"]],
//             ["RAM Size", "ram.size", ["16GB", "32GB", "8GB"]],
//             ["Storage Type", "storage.type", ["SSD"]],
//             ["Storage Capacity", "storage.capacity", ["1TB", "256GB", "512GB"]],
//             ["Operating System", "operatingSystem", ["Chrome OS", "Windows 11", "macOS"]],
//             ["Status", "status", ["Available", "Out of Stock"]],
//             ["Color", "color", ["Silver", "Black"]],
//         ];
//         setAvailableOptions(list);
//         setLoading(false);
//     };




//     const convertToMongodbFormat = (selectedOptions, availableOptions) => {
//         return availableOptions
//             .map(([label, key, values]) => {
//                 if (selectedOptions[key] && selectedOptions[key].length > 0) {
//                     return [label, key, selectedOptions[key]];
//                 }
//                 return null;
//             })
//             .filter(Boolean);
//     };



//     const handleSelectChange = (category, selectedValues) => {
//         setSelectedOptions((prev) => {
//             if (selectedValues.length === 0) {
//                 const updatedOptions = { ...prev };
//                 delete updatedOptions[category];
//                 return updatedOptions;
//             }
//             return { ...prev, [category]: selectedValues };
//         });
//     };

//     return (
//         <div className="p-6">
//             {loading ? (
//                 <div className="text-center">
//                     <p className="text-lg">Loading, please wait...</p>
//                     <div className="animate-spin w-8 h-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto mt-4"></div>
//                 </div>
//             ) : (
//                 <div className="flex flex-col md:flex-row gap-6">
//                     {/* Left Section: Filters */}
//                     <div className="w-full md:w-1/2 p-4 border rounded-lg shadow-md">
//                         <h1 className="text-xl font-semibold mb-2">Available Options</h1>
//                         <p className="text-gray-600 mb-4">Select suitable options to filter products.</p>
//                         <div>
//                             <p>Price Selecter</p>
//                             <input type="range" name="" id="" />
//                         </div>
//                         <div>
//                             <p>Category Selector</p>
//                         </div>
//                         <p className="mt-6 text-xl text-blue-500">Field Selector</p>
//                         {availableOptions.map((option) => (
//                             <SingleOptionBox key={option[1]} data={option} onSelect={handleSelectChange} />
//                         ))}
//                     </div>

//                     {/* Right Section: Selected Filters */}
//                     <div className="w-full md:w-1/2 p-4 border rounded-lg shadow-md bg-red-100">
//                         <h1 className="text-xl font-semibold mb-2">Selected Filters</h1>
//                         {Object.keys(selectedOptions).length === 0 ? (
//                             <p className="text-gray-500">No filters selected.</p>
//                         ) : (
//                             <div className="space-y-2">
//                                 {Object.entries(selectedOptions).map(([key, values]) => (
//                                     <p key={key} className="bg-white p-2 rounded shadow">
//                                         <span className="font-bold">{key}:</span> {values.join(", ")}
//                                     </p>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className="bg-green-900 p-5 text-white max-w-[500px]">
//                         <h1 className="text-gray-600 bg-white p-6 ">Array that is going to get generated</h1>
//                         <div className="text-sm">
//                             {
//                                 JSON.stringify(convertToMongodbFormat(selectedOptions, availableOptions), null, 2)

//                             }
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const SingleOptionBox = ({ data, onSelect }) => {
//     const [selectedValues, setSelectedValues] = useState([]);

//     const handleChange = (event) => {
//         const { value, checked } = event.target;
//         let updatedValues = checked
//             ? [...selectedValues, value]
//             : selectedValues.filter((val) => val !== value);

//         setSelectedValues(updatedValues);
//         onSelect(data[1], updatedValues);
//     };

//     return (
//         <div className="mb-4">
//             <p className="text-lg font-semibold">{data[0]}</p>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
//                 {data[2].map((optionValue) => (
//                     <label key={optionValue} className="flex items-center space-x-2 cursor-pointer">
//                         <input
//                             type="checkbox"
//                             value={optionValue}
//                             checked={selectedValues.includes(optionValue)}
//                             onChange={handleChange}
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         />
//                         <span className="text-sm">{optionValue}</span>
//                     </label>
//                 ))}
//             </div>

//         </div>
//     );
// };

// export default App;














//price range finder


// import React, { useState } from "react";

// const PriceSelector = () => {
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(300000);

//   const handleMinChange = (e) => {
//     const value = Math.min(parseInt(e.target.value), maxPrice - 1000);
//     setMinPrice(value);
//   };

//   const handleMaxChange = (e) => {
//     const value = Math.max(parseInt(e.target.value), minPrice + 1000);
//     setMaxPrice(value);
//   };

//   // Calculate percentages for styling
//   const minPercent = (minPrice / 300000) * 100;
//   const maxPercent = (maxPrice / 300000) * 100;

//   return (
//     <div className="p-4">
//       <p className="font-semibold text-lg">
//         Price Range: ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
//       </p>
      
//       <div className="relative w-full mt-4 h-6">
//         {/* Background Track */}
//         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2" />
        
//         {/* Selected Range Track */}
//         <div
//           className="absolute top-1/2 h-1 bg-blue-500 rounded-full transform -translate-y-1/2"
//           style={{
//             left: `${minPercent}%`,
//             width: `${maxPercent - minPercent}%`,
//           }}
//         />

//         {/* Slider Thumbs */}
//         <div className="relative w-full">
//           <input
//             type="range"
//             min="0"
//             max="300000"
//             step="1000"
//             value={minPrice}
//             onChange={handleMinChange}
//             className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:appearance-none"
//           />
//           <input
//             type="range"
//             min="0"
//             max="300000"
//             step="1000"
//             value={maxPrice}
//             onChange={handleMaxChange}
//             className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:appearance-none"
//           />
//         </div>
//       </div>

//       {/* Manual Input Fields */}
//       <div className="flex justify-between mt-4">
//         <input
//           type="number"
//           min="0"
//           max="300000"
//           step="1000"
//           value={minPrice}
//           onChange={handleMinChange}
//           className="border p-2 w-24 text-center rounded-md"
//         />
//         <span className="mx-2 text-lg font-semibold">to</span>
//         <input
//           type="number"
//           min="0"
//           max="300000"
//           step="1000"
//           value={maxPrice}
//           onChange={handleMaxChange}
//           className="border p-2 w-24 text-center rounded-md"
//         />
//       </div>
//     </div>
//   );
// };

// export default PriceSelector;





// import React, { useEffect, useState } from 'react';
// import {axiosInstance} from '../../api/axiosConfig';
// import { toast } from 'react-toastify';

// const Routhwork = () => {
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);

//     const fetchCategoryList = async () => {
//         try {
//             const response = await axiosInstance.get('/get_category_list');
//             if (!response.data || !response.data.categories) {
//                 toast.error("No category list fetched");
//                 return;
//             }
//             console.log("Fetched Categories:", response.data.categories);
//             setCategories(response.data.categories);
//         } catch (error) {
//             toast.error("An error occurred while fetching category list");
//         }
//     };

//     useEffect(() => {
//         fetchCategoryList();
//     }, []);

//     const handleSelectingCategories = (categoryId) => {
//         setSelectedCategories((prev) =>
//             prev.includes(categoryId)
//                 ? prev.filter((id) => id !== categoryId) // Remove if already selected
//                 : [...prev, categoryId] // Add if not selected
//         );
//     };

//     return (
//         <>
//             <div className="font-semibold">Category Selector</div>
//             <div>
//                 {categories.map((category) => (
//                     <div key={category._id}>
//                         <input
//                             type="checkbox"
//                             id={`category-${category._id}`}
//                             value={category._id}
//                             onChange={() => handleSelectingCategories(category._id)}
//                             checked={selectedCategories.includes(category._id)}
//                         />
//                         <label htmlFor={`category-${category._id}`}>{category.name}</label>
//                     </div>
//                 ))}
//             </div>
//             <div className="mt-4">
//                 <strong>Selected Categories:</strong>
//                 <pre>{JSON.stringify(selectedCategories, null, 2)}</pre>
//             </div>
//         </>
//     );
// };

// export default Routhwork;




import React from 'react'

const routhwork = () => {
  return (
    <div>routhwork</div>
  )
}

export default routhwork