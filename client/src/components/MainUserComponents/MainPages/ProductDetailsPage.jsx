import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import {axiosInstance} from '../../../api/axiosConfig'
import {productService} from '../../../apiServices/userApiServices'
import ProductDetail from "../../UserComponents/products/ProductDetail";
import ProductCollection from "../../UserComponents/products/ProductCollection";
import {toast} from 'sonner'

const ProductDetailedViewPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [categoryId, setCategoryId] = useState(null); 

 const navigate = useNavigate();
  const fetchProductDetails = async () => {
    try {
      const response = await productService.getProductDetails(id);
      
      if (response.data.success) {
        const { productDetails } = response.data;
        setProduct(productDetails);
        setCategoryId(productDetails.category._id);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching product details';
      
      // Handle specific status codes
      switch (error.response?.status) {
        case 404:
          toast.error('Product not found');
          navigate('/user/home')
          break;
        case 403:
          toast.error(error.response.message||'Your Product has been blocked by administrator');
          navigate('/user/home')
          break;
        case 400:
          toast.error(errorMessage);
          break;
        case 500:
          toast.error('Server error occurred. Please try again later.');
          break;
        default:
          toast.error('An unexpected error occurred');
      }
      
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails(); 
  }, [id]);

  if (!product) {
    return <div>Loading product details...</div>; 
  }

  return (
    <div>
     
      <ProductDetail productId={id} />

 
      {categoryId && <ProductCollection categoryId={categoryId} />}
    
    </div>
  );
};

export default ProductDetailedViewPage;
