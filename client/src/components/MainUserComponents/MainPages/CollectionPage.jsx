import React, { useState, useEffect } from 'react';
import {productService} from '../../../apiServices/userApiServices.jsx'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProductCollection from '../../UserComponents/products/ProductCollection';

const CategoryProducts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      
      
      const response = await productService.getCategoryList();
     
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error('Failed to fetch categories');
        setError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Error fetching categories");
      setError('Error fetching categories');
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 ">
      {/* <h1 className="text-4xl font-bold text-center mb-12">Featured Products by Category</h1> */}
      {categories.map(category => (
        <div key={category._id} className="mb-16">
          <ProductCollection categoryId={category._id} categoryName={category.name} />
        </div>
      ))}
    </div>
  );
};

export default CategoryProducts;
