import React from 'react'
import {useNavigate} from 'react-router-dom'
export default function Banner() {
  const navigate = useNavigate()
  const navigateToShopPage = () => {
    
    navigate("/user/shop")
  }
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="https://wallpapers.com/images/high/4k-laptop-sunrise-outdoor-workspace-leiadudkns65637q.webp"
          alt="Laptop Display"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-2xl md:text-4xl font-light tracking-widest text-center mb-8">
          WELCOME TO THE KERALAS LARGEST LAPTOP ONLINE SHOP
        </h1>
        
        <button 
          className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-300 hover:text-gray-600 transition-colors duration-300 font-medium"
          onClick={() => navigateToShopPage()}
        >
          Shop Now
        </button>
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  )
}

