import React, { useState, useEffect } from 'react';
import CouponCard from '../../../components/UserComponents/coupons/couponCardForCouponsPage';

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [filter, setFilter] = useState('All');

  const dummyCoupons = [
    { id: 1, couponCode: 'SUMMER21', minPurchaseAmount: 50, maxDiscountPrice: 10, status: 'Not Used' },
    { id: 2, couponCode: 'FALL21', minPurchaseAmount: 100, maxDiscountPrice: 25, status: 'Used' },
    { id: 3, couponCode: 'WINTER21', minPurchaseAmount: 75, maxDiscountPrice: 15, status: 'Expired' },
    { id: 4, couponCode: 'SPRING22', minPurchaseAmount: 60, maxDiscountPrice: 12, status: 'Not Used' },
    { id: 5, couponCode: 'WELCOME10', minPurchaseAmount: 30, maxDiscountPrice: 5, status: 'Not Used' },
    { id: 6, couponCode: 'FLASH50', minPurchaseAmount: 200, maxDiscountPrice: 50, status: 'Expired' },
  ];

  useEffect(() => {   
    setCoupons(dummyCoupons);
  }, []);

  const filteredCoupons = coupons.filter(coupon => {
    if (filter === 'All') return true;
    return coupon.status === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className=' flex flex-col sm:flex-row justify-between items-center mb-8'>
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Coupons</h1>
        <div className='flex flex-wrap gap-2 justify-center sm:justify-end'>
          {['All', 'Not Used', 'Used', 'Expired'].map((option) => (
            <button
              key={option}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex flex-wrap justify-center sm:justify-start">
        {filteredCoupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  );
};

export default Coupon;

