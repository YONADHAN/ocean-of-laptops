




import React from 'react'
import {useNavigate} from 'react-router-dom'

export default function Banner() {
  const navigate = useNavigate()
  
  return (
    <div className="relative w-full h-[90vh] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          
          src='https://helios-i.mashable.com/imagery/articles/044VW5dDLiH5aqARLFTP6qP/hero-image.fill.size_1248x702.v1710778445.png'
          alt="Laptop Display"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
            Kerala's Premier Destination for <span className="text-blue-400">Premium Laptops</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Discover the perfect blend of performance and style with our curated collection of cutting-edge laptops
          </p>
          <button 
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
            onClick={() => navigate("/shop")}
          >
            Explore Collection →
          </button>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
    </div>
  )
}