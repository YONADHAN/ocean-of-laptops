import React, { useState, useEffect } from 'react';
import { Tag, X } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const CouponCard = ({ totalAmount = 0, onApplyCoupon, onClearCoupon }) => {
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [userId, setUserId] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    if (totalAmount) {
      fetchAvailableCoupons(totalAmount);
    }
  }, [totalAmount]);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      toast.error('Token not found');
      return;
    }
    const decoded = jwtDecode(token);
    setUserId(decoded._id);
  }, []);

  const fetchAvailableCoupons = async (amount) => {
    try {
      const response = await axiosInstance.post('/get_suitable_coupons', { amount });
      if (response.status === 200) {
        setAvailableCoupons(response.data.coupons);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch available coupons');
    }
  };

  const handleCouponSelect = (code) => {
    setCouponCode(code);
    setShowModal(false);
  };

  const handleApply = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (couponApplied) {
      // Clear coupon logic
      setCouponCode('');
      setCouponApplied(false);
      if (onClearCoupon) {
        onClearCoupon();
      }
      toast.success('Coupon removed successfully!');
    } else {
      // Apply coupon logic
      try {
        const response = await axiosInstance.post('/apply_coupon', {
          couponCode,
          amount: totalAmount,
          userId,
        });

        if (response.status === 200) {
          onApplyCoupon(response.data.discountApplied, couponCode);
          setCouponApplied(true);
          toast.success('Coupon applied successfully!');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to apply coupon');
      }
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4 shadow-md">
        <div className="flex items-center gap-2 text-blue-600 mb-3">
          <Tag className="w-5 h-5" />
          <h2 className="font-semibold">Apply Your Coupon</h2>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-1.5 text-sm rounded border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
              disabled={couponApplied}
            />
            <button
              onClick={() => setShowModal(true)}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100"
              disabled={couponApplied}
            >
              View All
            </button>
          </div>

          <button
            onClick={handleApply}
            className={`w-full py-1.5 rounded transition-colors ${
              couponApplied ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {couponApplied ? 'Remove' : 'Apply'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">Available Coupons</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="space-y-3">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.couponCode}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => handleCouponSelect(coupon.couponCode)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-600">
                        {coupon.couponCode}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {coupon.discountPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        upto <span className="text-yellow-500 text-base">{coupon.maxDiscountPrice}</span> Rs
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      for min. purchase of {coupon.minPurchaseAmount}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCard;
