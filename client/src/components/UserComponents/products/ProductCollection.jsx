import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProductCard from './productCardModel';
import {axiosInstance} from '../../../api/axiosConfig'
import {productService} from '../../../apiServices/userApiServices'
import LoadingSpinner from '../../../pages/others/commonReusableComponents/LoadingSpinner';
import {toast} from 'sonner'
const ProductCollection = ({ categoryId, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  const navigate = useNavigate();

  const goToProductDetailsPage = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/user/product_detail/${productId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
  
      // const response = await axiosInstance.get(
      //   `/get_products_by_category?id=${categoryId}&page=${currentPage}&limit=4`
      // );

      const response = await productService.getProductsByCategory(
        categoryId,
        currentPage,
        4,
      );
  
      if (response.data.success) {
        if (currentPage === 1) {
          setProducts(response.data.products);
        } else {
          setProducts((prev) => [...prev, ...response.data.products]);
        }
        setTotalPages(response.data.totalPages);
        console.log("Products successfully fetched!");
        // toast.success("Products successfully fetched!");
      } else {
        console.log(response.data.message || "Failed to fetch products.")
        //toast.error(response.data.message || "Failed to fetch products.");
      }
    } catch (error) {
   
      const errorMessage = error.response?.data?.message || "Failed to fetch products.";
      const statusCode = error.response?.status;
  
    
      switch (statusCode) {
        case 400:
          //toast.error(errorMessage || "Invalid category ID or category is blocked.");
          console.log(errorMessage || "Invalid category ID or category is blocked.")
          break;
        case 404:
          //toast.error("Category or products not found.");
          console.log("Category or products not found.");
          break;
        case 500:
          //toast.error("Server error occurred. Please try again later.");
          console.log("Server error occurred. Please try again later.");
          break;
        default:
          //toast.error("An unexpected error occurred. Please try again.");
          console.log("An unexpected error occurred. Please try again.");
      }
  
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };


  const truncateWords = (text, wordLimit = 6) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  const calculateDiscount = (product) => {
    if (product.regularPrice > product.salePrice) {
      const discount = ((product.regularPrice - product.salePrice) / product.regularPrice) * 100;
      return discount.toFixed(0);
    }
    return null;
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryId]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  if(products.length ===0 && !loading){
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">{categoryName} Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onProductClick={goToProductDetailsPage}
          />
        ))}
      </div>

      {currentPage < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="gray" />
                <span>Loading...</span>
              </>
            ) : (
              'More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCollection;

