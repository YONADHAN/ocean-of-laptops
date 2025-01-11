import {React,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {axiosInstance } from '../../../../api/axiosConfig';

  
const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  

  const handleContinueShopping = () => {
    
    navigate('/user/shop');
    
  };

  const goToOrder = () => {
    navigate('/user/features/order')
  }
  const clearCart = () => {
    const clear = axiosInstance.get('clear_cart');
    if(clear.status === '200') {
        console.log('Cart cleared successfully');
      } else {
        console.log('Failed to clear cart');
  
    }
  };
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <p className="text-center text-md text-gray-700">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          </div>
          <div className='flex gap-2'>
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
      </div>
    </div>
  );
};

export default OrderConfirmation;