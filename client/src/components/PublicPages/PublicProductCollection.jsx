import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../UserComponents/products/productCardModel';
import {axiosInstance} from '../../api/axiosConfig'


const ProductCollection = ({ categoryId, categoryName, fromLandingPage = false }) => {
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
     
      const response = await axiosInstance.get(`/public/public_get_products_by_category?id=${categoryId}&page=${currentPage}&limit=4`);
      
      if (response.data.success) {
        if (currentPage === 1) {
          setProducts(response.data.products);
        } else {
          setProducts(prev => [...prev, ...response.data.products]);
        }
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">{categoryName} Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onProductClick={goToProductDetailsPage}
            fromLandingPage = {fromLandingPage}
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
            {loading ? 'Loading...' : 'More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCollection;

