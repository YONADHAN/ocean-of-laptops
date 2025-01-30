// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { axiosInstance } from '../../api/axiosConfig';

// // Separate Modal component with Tailwind styling
// const PaymentModal = ({ isOpen, onClose, message, success }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-sm w-full m-4">
//         <div className={`text-center mb-4 ${success ? 'text-green-600' : 'text-red-600'}`}>
//           <p className="text-lg font-semibold">{message}</p>
//         </div>
//         <div className="flex justify-center">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Custom hook for payment handling
// const usePaymentHandler = (orderId) => {
//   const navigate = useNavigate();
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     message: '',
//     success: false
//   });

//   const closeModal = () => {
//     setModalState(prev => ({ ...prev, isOpen: false }));
//     if (modalState.success) {
//       navigate(`/confirmation/${orderId}`);
//     }
//   };

//   const handlePayment = async () => {
//     try {
//       const order = await axiosInstance.get(`/get_order/${orderId}`);
//       if (!order) {
//         toast.error("Order not found. Please try again.");
//         return;
//       }

//       const paymentStatus = order.data.order.paymentStatus;
//       const shippingAddress = order.data.order.shippingAddress;

//       if (paymentStatus === "Completed") {
//         setModalState({
//           isOpen: true,
//           message: "Payment already completed.",
//           success: true
//         });
//         return;
//       }

//       const { data: razorpayOrder } = await axiosInstance.post("/retry_payment", { orderId });
//       if (!razorpayOrder.id) {
//         setModalState({
//           isOpen: true,
//           message: "Failed to create a new Razorpay order.",
//           success: false
//         });
//         return;
//       }

//       const options = {
//         key: "rzp_test_2aUGLgE6VrGTVa",
//         amount: razorpayOrder.amount,
//         currency: "INR",
//         name: "LaptopHub",
//         description: "Retrying payment for your order",
//         order_id: razorpayOrder.id,
//         retry: { enabled: false },
//         handler: async (response) => {
//           try {
//             const verifyRes = await axiosInstance.post("/verify_razorpay_payment", {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             setModalState({
//               isOpen: true,
//               message: verifyRes.data.success ? "Payment successful!" : "Payment verification failed.",
//               success: verifyRes.data.success
//             });

//           } catch (err) {
//             console.error("Error verifying payment:", err);
//             setModalState({
//               isOpen: true,
//               message: "Error during payment verification.",
//               success: false
//             });
//           }
//         },
//         prefill: {
//           name: shippingAddress.name,
//           email: shippingAddress.email,
//           contact: shippingAddress.phone,
//         },
//         theme: { color: "#3399cc" },
//       };

//       const razorpayInstance = new window.Razorpay(options);
//       razorpayInstance.open();

//       razorpayInstance.on("payment.failed", (response) => {
//         console.error("Payment failed:", response.error);
//         setModalState({
//           isOpen: true,
//           message: "Payment failed. Please try again.",
//           success: false
//         });
//       });

//     } catch (error) {
//       console.error("Error initializing Razorpay:", error);
//       setModalState({
//         isOpen: true,
//         message: "Failed to initialize Razorpay. Please try again.",
//         success: false
//       });
//     }
//   };

//   return { handlePayment, modalState, closeModal };
// };



