




// import React, { useState, useEffect } from "react";

// const PriceSelector = ({onPriceChange ,refreshOption}) => {
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(300000);


//   useEffect(()=> {
//     setMinPrice(0);
//     setMaxPrice(300000)
//   },[refreshOption])

//   useEffect(()=> {
//     onPriceChange([minPrice,maxPrice])
//   },[minPrice,maxPrice,onPriceChange])



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
//       <p className="font-semibold ]">
//         Price Selector:
//         <div className="text-[.9rem]">
//         ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
//         </div>
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
//             className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:appearance-none"
//           />
//           <input
//             type="range"
//             min="0"
//             max="300000"
//             step="1000"
//             value={maxPrice}
//             onChange={handleMaxChange}
//             className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:appearance-none"
//           />
//         </div>
//       </div>

//       {/* Manual Input Fields */}
//       <div className="flex justify-between mt-4 -ml-10 scale-75">
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


import React, { useState, useEffect } from "react";

const PriceSelector = ({ onPriceChange, refreshOption }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300000);

  // Reset values when refreshOption changes
  useEffect(() => {
    setMinPrice(0);
    setMaxPrice(300000);
  }, [refreshOption]);

  // Call onPriceChange only when necessary
  useEffect(() => {
    onPriceChange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]); // Removed onPriceChange from dependencies to avoid unnecessary re-renders

  // Handle min price change
  const handleMinChange = (e) => {
    const value = Math.max(0, Math.min(parseInt(e.target.value) || 0, maxPrice - 1000));
    setMinPrice(value);
  };

  // Handle max price change
  const handleMaxChange = (e) => {
    const value = Math.min(300000, Math.max(parseInt(e.target.value) || 0, minPrice + 1000));
    setMaxPrice(value);
  };

  // Calculate percentages for styling
  const minPercent = (minPrice / 300000) * 100;
  const maxPercent = (maxPrice / 300000) * 100;

  return (
    <div className="p-4">
      <p className="font-semibold">
        Price Selector:
        <div className="text-[.9rem]">
          ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
        </div>
      </p>

      {/* Price Range Slider */}
      <div className="relative w-full mt-4 h-6">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2" />

        {/* Selected Range Track */}
        <div
          className="absolute top-1/2 h-1 bg-blue-500 rounded-full transform -translate-y-1/2"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Slider Thumbs */}
        <div className="relative w-full">
          <input
            type="range"
            min="0"
            max="300000"
            step="1000"
            value={minPrice}
            onChange={handleMinChange}
            className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none"
          />
          <input
            type="range"
            min="0"
            max="300000"
            step="1000"
            value={maxPrice}
            onChange={handleMaxChange}
            className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none"
          />
        </div>
      </div>

      {/* Manual Input Fields */}
      <div className="flex justify-between mt-4 -ml-10 scale-75">
        <input
          type="number"
          min="0"
          max="300000"
          step="1000"
          value={minPrice}
          onChange={handleMinChange}
          className="border p-2 w-24 text-center rounded-md"
        />
        <span className="mx-2 text-lg font-semibold">to</span>
        <input
          type="number"
          min="0"
          max="300000"
          step="1000"
          value={maxPrice}
          onChange={handleMaxChange}
          className="border p-2 w-24 text-center rounded-md"
        />
      </div>
    </div>
  );
};

export default PriceSelector;
