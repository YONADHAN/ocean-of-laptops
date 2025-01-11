import React, { useState, useEffect } from "react";
import axios from "axios";
import {axiosInstance} from '../../../../../api/axiosConfig';
import {productService} from '../../../../../apiServices/userApiServices'
import ProductCard from "../../../../UserComponents/products/productCardModel";
import { useNavigate } from "react-router-dom";

const ProductList = ({ filters, sort, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  if (error) {
    return <div>{error}</div>;
  }
  console.log("filter is : ",filters)
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [sortField, sortOrder] = sort.split(":");
      const params = { ...filters, page: currentPage, sort: sortField + ":" + sortOrder, searchQuery: searchQuery };

      // const response = await axiosInstance.get("/filter_products", { params });
      const response = await productService.filterProducts(params);
      const { products, totalPages } = response.data;

      setProducts(products || []);
      setTotalPages(totalPages || 0);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchProducts();
  }, [filters, sort, currentPage,searchQuery]);

  const handlePageChange = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const goToProductDetailsPage = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/user/product_detail/${productId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
 const next = ">"
 const prev = "<"
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onProductClick={() => goToProductDetailsPage(product._id)}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            
            {prev}
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-full ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {next}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
