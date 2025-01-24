import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { toast } from "sonner";
import { axiosInstance } from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ product, onProductClick }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [textColor, setTextColor] = useState("text-gray-600");

  useEffect(() => {
    console.log("Product", product);
    switch (product.status) {
      case "Available":
        setTextColor("text-green-600");
        break;
      case "Out of Stock":
        setTextColor("text-red-600");
        break;
      case "Coming Soon":
        setTextColor("text-yellow-600");
        break;
      case "Discontinued":
        setTextColor("text-red-600");
        break;
      default:
        setTextColor("text-gray-600");
    }
  }, [product.status]);

  // const AddToCart = async () => {
  //   try {
  //     const response = await axiosInstance.post("/add_to_cart", {
  //       productId: product._id,
  //       quantity: 1,
  //     });
  //     if (response.status === 200) {
  //       toast.success("Added to cart");
  //     }
  //     if (response.status === 400) {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     if (error.status === 404) {
  //       toast.error("Product not found");
  //     } else {
  //       toast.error("Error adding to cart");
  //       console.log("Error adding to cart:");
  //     }
  //   }
  // };

  const handleWishlistChange = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      const decoded = jwtDecode(token);
      const userId = decoded._id;
      const productId = product._id;
  
      const endpoint = isWishlist ? "/remove_from_wishlist" : "/add_to_wishlist";
      const successMessage = isWishlist 
        ? "Removed from wishlist" 
        : "Added to wishlist";
  
      const response = await axiosInstance.post(endpoint, { userId, productId });
  
      if (response.status === 200) {
        setIsWishlist(!isWishlist);
        toast.success(successMessage);
      }
    } catch (error) {
      const errorMessage = isWishlist 
        ? "Error while removing from wishlist" 
        : "Error adding to wishlist";
      toast.error(error.response?.data?.message || errorMessage);
    }
  };
  






  const AddToCart = async () => {
    try {
      const response = await axiosInstance.post("/add_to_cart", {
        productId: product._id,
        quantity: 1,
      });
  
      if (response.status === 200) {
        toast.success("Added to cart");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status outside 2xx range
        const { status, data } = error.response;
  
        if (status === 404) {
          toast.error("Product not found");
        } else if (status === 400) {
          toast.error(data.message || "Bad Request");
        } else {
          toast.error("Error adding to cart");
        }
      } else {
        // Network error or server didn't respond
        toast.error("Network error. Please try again later.");
      }
      console.error("Error adding to cart:", error);
    }
  };
  
  const navigate = useNavigate();
  const HandleBuyNow = async (req, res) => {
    try {
      // Add product to cart and redirect to checkout page
      const response = await axiosInstance.post("/add_to_cart", {
        productId: product._id,
        quantity: 1,
      });
      if (response.status === 200) {
        toast.success("Error in buying the product");
      }
      //redirect to checkout page
      navigate("/user/features/cart/checkout");
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  };

  const calculateDiscount = () => {
    if (product.regularPrice > product.salePrice) {
      const discount =
        ((product.regularPrice - product.salePrice) / product.regularPrice) *
        100;
      return discount.toFixed(0);
    }
    return null;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <AiFillStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 max-w-[300px] ">
      <div className="relative">
        <img
          src={product.productImage[0]}
          alt={product.productName}
          className="w-full h-50 object-contain"
        />
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        >



          <FiHeart
            onClick={handleWishlistChange}
            className={`w-5 h-5 ${
              isWishlist ? "fill-red-700 text-red-700" : "text-gray-600"
            }`}
          />
 


        </button>
        {calculateDiscount() && (
          <span className="absolute bottom-0 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {calculateDiscount()}% OFF
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 h-7">
          {product.productName}
        </h3>
        <div>{product.description.slice(0, 20)}...</div>
        <div className="flex items-center">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-600 ml-1">
            ({product.rating}/5)
          </span>
        </div>

        <div className="flex items-center space-x-2 justify-between">
          <div>
            <span className="text-lg font-bold">₹{product.salePrice}</span>
            {product.regularPrice > product.salePrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{product.regularPrice}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-x-1 place-items-center">
          <div className="flex gap-x-1 items-center">
            <div className={`text-xl text-nowrap ${textColor}`}>
              {product.status}
            </div>
            <div>({product.quantity > 100 ? "100+" : product.quantity})</div>
          </div>
          <div className="flex gap-x-2 h-[40px] ">
            <button
              onClick={AddToCart}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors flex"
            >
              <FiShoppingCart className="w-6 h-6 " />
              <div className="pl-3">Cart</div>
            </button>
            {/* <button onClick={HandleBuyNow} className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Buy Now
          </button>  */}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => onProductClick(product._id)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
