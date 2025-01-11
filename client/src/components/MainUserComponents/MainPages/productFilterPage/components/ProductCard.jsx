import React from 'react'
import { FiHeart } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
          <FiHeart className="w-5 h-5 text-gray-600" />
        </button>
        {product.discount && (
          <span className="absolute bottom-0 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
        
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <AiFillStar
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
        </div>
        
        <div className="flex items-center space-x-2 justify-between">
          <div>
          <span className="text-lg font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
          </div>
         <div>
            <button className='px-2 py-2 bg-gray-600 text-white rounded-lg'>Cart+</button>
            <button className='bg-green-600 text-white px-3 py-2 rounded-lg ml-1 '>Buy Now</button>
         </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          View Product
        </button>
      </div>
    </div>
  )
}

