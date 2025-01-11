import React from 'react';
import ProductCard from '../../../UserComponents/products/productCardModel';

const ProductList = ({ products, loading, onProductClick }) => {
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onProductClick={onProductClick} />
      ))}
    </div>
  );
};

export default ProductList;

