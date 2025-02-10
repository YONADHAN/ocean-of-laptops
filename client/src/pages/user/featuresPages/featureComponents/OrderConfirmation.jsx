// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import { axiosInstance } from "../../../../api/axiosConfig"
// import Confetti from "react-confetti"

// const OrderConfirmation = () => {
//   const { orderId } = useParams()
//   const navigate = useNavigate()
//   const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
//   const [showConfetti, setShowConfetti] = useState(true) // Controls Confetti visibility

//   const handleContinueShopping = () => {
//     navigate("/shop")
//   }

//   const goToOrder = () => {
//     navigate("/user/features/order")
//   }

//   const clearCart = () => {
//     const clear = axiosInstance.get("clear_cart")
//     if (clear.status === "200") {
//       console.log("Cart cleared successfully")
//     } else {
//       console.log("Failed to clear cart")
//     }
//   }

//   useEffect(() => {
//     clearCart()

//     const handleResize = () => {
//       setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
//     }

//     window.addEventListener("resize", handleResize)

   
//     const timer = setTimeout(() => setShowConfetti(false), 6000)

//     return () => {
//       window.removeEventListener("resize", handleResize)
//       clearTimeout(timer) 
//     }
//   }, []) 

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       {showConfetti && (
//         <Confetti 
//           width={windowDimensions.width} 
//           height={windowDimensions.height} 
//           recycle={false} 
//           numberOfPieces={500} 
//           wind={0.01} 
//           tweenDuration={3000} 
//         />
//       )}
//       <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Thank you for your purchase. Your order has been successfully placed.
//           </p>
//         </div>
//         <div className="mt-8 space-y-6">
//           <div className="rounded-md shadow-sm -space-y-px">
//             <p className="text-center text-md text-gray-700">
//               Order ID: <span className="font-semibold">{orderId}</span>
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={handleContinueShopping}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Continue Shopping
//             </button>
//             <button
//               onClick={goToOrder}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Go to Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OrderConfirmation







"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../../../../api/axiosConfig"
import Confetti from "react-confetti"
import { motion } from "framer-motion" 

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [showConfetti, setShowConfetti] = useState(true) 

  const handleContinueShopping = () => {
    navigate("/shop")
  }

  const goToOrder = () => {
    navigate("/user/features/order")
  }

  const clearCart = () => {
    const clear = axiosInstance.get("clear_cart")
    if (clear.status === "200") {
      //console.log("Cart cleared successfully")
    } else {
      //console.log("Failed to clear cart")
    }
  }

  useEffect(() => {
    clearCart()

    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)

    const timer = setTimeout(() => setShowConfetti(false), 6000)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer) 
    }
  }, []) 

  return (
    <div className="h-[500px] bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {showConfetti && (
        <Confetti 
          width={windowDimensions.width} 
          height={windowDimensions.height} 
          recycle={false} 
          numberOfPieces={500} 
          wind={0.01} 
          tweenDuration={3000} 
        />
      )}
      
      {/* Animated Modal */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}  // Start position (hidden & below)
        animate={{ opacity: 1, y: 0 }}   // End position (fully visible)
        transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md"
      >
        <div>
          <h2 className="mt-6 text-center  text-3xl font-extrabold text-blue-800">Order Confirmed!</h2>
          <p className="mt-2 text-center text-sm text-blue-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <p className="text-center text-md text-gray-700">
              Order ID: <span className="font-semibold text-green-700">{orderId}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleContinueShopping}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>
            <button
              onClick={goToOrder}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderConfirmation
