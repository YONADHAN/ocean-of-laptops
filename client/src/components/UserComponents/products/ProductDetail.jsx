import React, { useState, useEffect, useRef } from "react";
import {Minus, Plus, ChevronRight } from "lucide-react";
import { FiHeart } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  productService,
  cartService,
  wishlistService,
} from "../../../apiServices/userApiServices";
import { axiosInstance } from "../../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const ProductDetailPage = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product details using the service
        const response = await productService.getProductDetails(productId);

        if (!response || !response.data.success) {
          throw new Error(response?.data?.message || "Failed to fetch product");
        }

        setProduct(response.data.productDetails);
        console.log("Product details", response.data.productDetails);
      } catch (err) {
        const status = err.response?.status;
        const errorMessage =
          err.response?.data?.message || "Failed to fetch product";

        // Handle different status codes for better UX
        switch (status) {
          case 403: // Forbidden
            toast.error(errorMessage || "Access forbidden");
            navigate("/user/home");
            break;
          case 404: // Not found
            toast.error("Product details not found");
            navigate("/user/home");
            break;
          case 400: // Bad request
            toast.error("Invalid product ID");
            break;
          case 500: // Server error
            toast.error("An internal server error occurred");
            break;
          default:
            toast.error(errorMessage);
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsZoomed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (product?._id) {
      getWishlistStatus();
    }
  }, [product]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!product) return null;

  const handleQuantityChange = async (action) => {
    try {
      const response = await axiosInstance.post("get_quantity", {
        productId: product._id,
      });

      if (!response || !response.data.success) {
        toast.error(
          response?.data?.message || "Unable to fetch stock information."
        );
        return;
      }

      const quantityInfoFromBackend = response.data.quantity;

      if (
        quantity < quantityInfoFromBackend ||
        (quantity === quantityInfoFromBackend && action === "decrease")
      ) {
        if (action === "increase") {
          if (quantity === 5) {
            toast.error("Maximum quantity allowed per order is 5.");
            return;
          }
          setQuantity((prev) => prev + 1);
        } else if (action === "decrease" && quantity > 1) {
          if (quantity === 1) {
            toast.error("Minimum quantity is 1.");
            return;
          }
          setQuantity((prev) => prev - 1);
        }
      } else {
        toast.error("Cannot exceed available stock.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update quantity. Please try again.";
      toast.error(errorMessage);

      if (error.response?.status === 403) {
        navigate("/user/home");
      }

      console.error("Error handling quantity change:", error);
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      setZoomPosition({ x, y });
    }
  };

  const indianCurrencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const handleAddToCart = async () => {
    try {
      // const response = await axiosInstance.post('/add_to_cart', {
      //   productId: product._id,
      //   quantity,
      // });
      const productId = product._id;
      const response = await cartService.addToCart(productId, quantity);

      if (!response || !response.data.success) {
        toast.error(
          response?.data?.message || "Failed to add product to cart."
        );
        return;
      }

      toast.success("Product added to cart successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";

      switch (err.response?.status) {
        case 400:
          toast.error(errorMessage);
          navigate("/user/home");
          break;
        case 401:
          toast.error(
            "You are not authorized. Please log in again. If the problem still exists, please logout and login again."
          );

          break;
        case 404:
          toast.error("Product not found. It may have been removed.");
          navigate("/user/home");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(errorMessage);
      }

      console.error("Error adding to cart:", err);
    }
  };



   const getWishlistStatus = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
  
        const decoded = jwtDecode(token);
        const userId = decoded._id;
        const productId = product._id;
  
        //const response = await axiosInstance.post(`/check_if_in_wishlist`, { userId, productId });
        const response = await wishlistService.getWishlistStatus(
          userId,
          productId
        );
  
        if (response.status === 200) {
          setIsWishlist(response.data.isInWishlist);
        } else {
          toast.error(response.data.message || "Unexpected response from server");
        }
      } catch (error) {
        console.error("Error getting wishlist status:", error);
        toast.error(
          error.response?.data?.message || "Failed to get wishlist data"
        );
      }
    };

  const handleWishlistChange = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const decoded = jwtDecode(token);
      const userId = decoded._id;
      const productId = product._id;

      console.log("Product ID:", productId);
      console.log("User ID:", userId);

      const successMessage = isWishlist
        ? "Removed from wishlist"
        : "Added to wishlist";

      let response = {};
      if (isWishlist) {
        response = await wishlistService.removeFromWishlist(userId, productId);
      } else {
        response = await wishlistService.addToWishlist(userId, productId);
      }

      if (response?.status === 200 && response.data.success !== false) {
        setIsWishlist(!isWishlist);
        toast.success(successMessage);
      } else {
        throw new Error(response.data.message || "Unexpected server response");
      }
    } catch (error) {
      console.error("Error in handleWishlistChange:", error);

      const errorMessage = isWishlist
        ? "Error while removing from wishlist"
        : "Error adding to wishlist";

      toast.error(error.response?.data?.message || errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <ChevronRight className="w-4 h-4" />
        <a href="/user/shop" className="hover:text-primary">
          Shop
        </a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-500">{product.productName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative">
            <div
              className="relative aspect-square overflow-hidden cursor-zoom-in "
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              ref={imageRef}
            >
              <img
                src={product.productImage[currentImage]}
                alt={product.productName}
                className="w-full h-full object-contain rounded-lg"
              />
              <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
                <FiHeart
                  onClick={handleWishlistChange}
                  className={`w-5 h-5 ${
                    isWishlist ? "fill-red-700 text-red-700" : "text-gray-600"
                  }`}
                />
              </button>
            </div>
            {isZoomed && (
              <div className="hidden md:block absolute top-16 left-full ml-4 w-[500px] h-[450px] rounded-lg shadow-lg bg-white overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${product.productImage[currentImage]})`,
                    backgroundPosition: `${zoomPosition.x * 100}% ${
                      zoomPosition.y * 100
                    }%`,
                    backgroundSize: "400%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.productImage.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  currentImage === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`${product.productName} - ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.productName}</h1>

          <div className="space-y-2">
            <p className="text-lg">
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>
            <p className="text-lg">
              Model Number:{" "}
              <span className="font-semibold">{product.modelNumber}</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-2xl text-gray-500 line-through">
              {indianCurrencyFormatter
                .format((product.regularPrice).toFixed(0))
                .replace(".00", "")}
            </div>
            <div className="text-3xl font-bold text-red-600">
              {indianCurrencyFormatter
                .format(Number(product.salePrice).toFixed(0))
                .replace(".00", "")
                }
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Processor</span>
                <span>
                  {product.processor.brand} {product.processor.model}{" "}
                  {product.processor.generation}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">RAM</span>
                <span>
                  {product.ram.size} {product.ram.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Storage</span>
                <span>
                  {product.storage.type} {product.storage.capacity}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Graphics</span>
                <span>
                  {product.graphics.model} ({product.graphics.vram})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Display</span>
                <span>
                  {product.display.size} - {product.display.resolution} (
                  {product.display.refreshRate}Hz)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Operating System</span>
                <span>{product.operatingSystem}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Battery Life</span>
                <span>{product.batteryLife} hours</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Weight</span>
                <span>{product.weight} kg</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Ports</span>
                <span>{product.ports}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-500">Product Category</span>
                <span>{product.category.name}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-500">{product.description}</p>
            <p className="text-lg">
              Status:
              <span
                className={`ml-2 font-semibold ${
                  product.status === "Available"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.status}
                {" ( " + product.quantity + " )"}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="p-3 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-6 py-2">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="p-3 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* <button className="px-8 py-3 bg-gray-400 text-black rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex-1">
              Buy Now
            </button> */}
            <button
              onClick={handleAddToCart}
              className="px-8 py-3 bg-gray-400 text-black rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex-1"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
