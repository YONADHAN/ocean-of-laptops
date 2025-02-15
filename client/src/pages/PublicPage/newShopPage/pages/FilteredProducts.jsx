// import React, { useState } from 'react'
// import ProductCard from '../../../../components/UserComponents/products/productCardModel'
// import {  useNavigate} from 'react-router-dom'
// const FilteredProducts = (productsData) => {
//   const navigate = useNavigate();
//   const handleProductClick = (productId) => {
//     navigate(`/product_detail/${productId}`)
//   }

//   return (
//     <div>

//       <h1>Filtered Products</h1>
//       {/* <p>{JSON.stringify(productsData.products)}</p> */}
//       {/* { product, onProductClick, fromLandingPage = false } */}
        
//        { productsData.products.map((product,index) => {
//         <div key={index}>
//           <productCard product={product} onProductClick={()=>handleProductClick(product._id)} />
//         </div>
//       })}

//     </div>
//   )
// }

// export default FilteredProducts


import React from 'react';
import ProductCard from '../../../../components/UserComponents/products/productCardModel';
import { useNavigate } from 'react-router-dom';

const FilteredProducts = ({ products = [] }) => {
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/product_detail/${productId}`);
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Filtered Products</h1>
            
            {/* Grid layout for products */}
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 md:gap-x-3  gap-6 justify-items-center">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className=' scale-90 lg:scale-100'>
                            <ProductCard 
                                product={product} 
                                onProductClick={handleProductClick}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-blue-500">
                        No products found
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilteredProducts;