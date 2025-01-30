import React, { useState } from "react";
import {Copy, ClipboardCopy, AlertCircle, ArrowRight , CircleX } from "lucide-react";
import {useNavigate} from 'react-router-dom'

const PaymentFailureModal = ({ isOpen, onClose, orderDetails }) => {
  const [isCoped, setIsCoped] = useState(false);
  if (!isOpen) return null;

  const navigate = useNavigate();
  const copyOrderId = () => {
    setIsCoped(true);
    navigator.clipboard.writeText(orderDetails.orderId);
    alert("Order ID copied to clipboard!");
  };

  const handleViewOrder = () => {
  
    navigate(`/user/features/order/trackMyOrderAndCancel/${orderDetails.mongodbId}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="w-full -mb-2 flex justify-end text-blue-500"  onClick={onClose}><CircleX /></div>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <AlertCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-blue-600">Payment Failed</h2>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-center text-gray-700">
            Your payment 
            {/* for{" "}
            <span className="font-semibold">{orderDetails.itemName}</span>  */}
            was unsuccessful, but don't worry! Your order has been placed.
          </p>
          <div
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 group"
            onClick={copyOrderId}
          >
            <p className="text-blue-800 font-medium mb-2 flex place-items-center gap-x-4 ">
              Order ID: {orderDetails.orderId}
              {isCoped && (<ClipboardCopy className="h-4 w-4 mr-2" />)}
              {!isCoped && (<Copy className="h-4 w-4 mr-2 group-hover:w-5 group-hover:h-5 " />)}
            </p>
            <p className="text-sm text-blue-600 mb-2">
              Please save this order ID for future reference.
            </p>
            <button className="flex items-center text-blue-700 hover:text-blue-900 transition-colors duration-200">
              {/* <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy Order ID */}
            </button>
          </div>
          <p className="text-red-500 font-semibold text-center">
            Please retry your payment within 2 days to avoid automatic order
            cancellation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* <button className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
              Retry Payment
            </button>
            <button className="w-full sm:w-auto bg-white text-blue-600 py-3 px-6 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 font-semibold ">
              Download Invoice
            </button> */}
            <button
              onClick = {handleViewOrder}
              className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-semibold flex items-center justify-center"
            >
              View Order
              {/* <ArrowRight className="h-5 w-5 ml-2" /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailureModal;
