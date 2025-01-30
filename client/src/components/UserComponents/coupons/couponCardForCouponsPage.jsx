import React from 'react';

const CouponCard = ({ coupon }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Used':
        return 'bg-green-100 text-green-800';
      case 'Used':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 w-64 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-2">{coupon.couponCode}</h3>
        <p className="text-gray-600 mb-2">Min. Purchase: ${coupon.minPurchaseAmount}</p>
        <p className="text-gray-600 mb-4">Max. Discount: ${coupon.maxDiscountPrice}</p>
      </div>
      <div className={`text-sm font-semibold px-2 py-1 rounded-full text-center ${getStatusColor(coupon.status)}`}>
        {coupon.status}
      </div>
    </div>
  );
};

export default CouponCard;

