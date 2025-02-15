import React, { useState } from 'react';

const SortingProducts = ({ onSortChange }) => {
    const [selectedState, setSelectedState] = useState("New Arrivals");
    const orderingOptions = ["New Arrivals", "A to Z", "Z to A", "Price High to Low", "Price Low to High"];

    const handleSortChange = (orderState) => {
        setSelectedState(orderState);
        onSortChange(orderState); 
    };

    return (
        <div className='py-2'>
            {orderingOptions.map((orderState, index) => (
                <div key={index}>
                    <input
                        type="radio"
                        name="sortingOption"
                        id={`order-${index}`}
                        value={orderState}
                        checked={selectedState === orderState}
                        onChange={() => handleSortChange(orderState)}
                    />
                    <label htmlFor={`order-${index}`}>{orderState}</label>
                </div>
            ))}
            
        </div>
    );
};

export default SortingProducts;
