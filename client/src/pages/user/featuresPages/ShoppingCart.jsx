
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosConfig";
import {cartService} from "../../../apiServices/userApiServices"
import Cookies from "js-cookie";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

export default function ShoppingCart() {
  const [products, setProducts] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [cartData, setCartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [blockedProducts, setBlockedProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
    fetchCartItems();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        navigate("/user/signin");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded._id;

     
      const response = await cartService.getCartData(userId);
      if (response.status === 200 && response.data.success) {
        setCartData(response.data.cart); 
      } else {
      
        console.error(response.data.message || "Failed to fetch cart");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
     
    }
  };

  const fetchCartItems = async () => {
    try {
    
      const token = Cookies.get("access_token");
      if (!token) {
        navigate("/user/signin");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded._id; 
      const response = await cartService.getCartItems(userId);

      if (response.data.success) {
        const cartItems = response.data.cartItems.map((item) => ({
          id: item.productId._id,
          name: item.productId.productName,
          brand: item.productId.brand,
          modelNumber: item.productId.modelNumber,
          processor: `${item.productId.processor.brand} ${item.productId.processor.model} ${item.productId.processor.generation}`,
          ram: `${item.productId.ram.size} ${item.productId.ram.type}`,
          storage: `${item.productId.storage.capacity} ${item.productId.storage.type}`,
          graphics: `${item.productId.graphics.model} ${item.productId.graphics.vram}`,
          display: `${item.productId.display.size} ${item.productId.display.resolution} ${item.productId.display.refreshRate}Hz`,
          operatingSystem: item.productId.operatingSystem,
          color: item.productId.color,
          price: item.productId.regularPrice,
          salePrice: item.productId.salePrice,
          stock: item.productId.quantity,
          quantity: item.quantity,
          image:
            item.productId.productImage[0] ||
            "/placeholder.svg?height=150&width=150",
        }));
        setProducts(cartItems);
      }
      toast.info(response.data.message);
    } catch (error) {
      if (error.status === 404) {
        toast.info("Add some Products before using cart");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, change) => {
    try {  
      const token = Cookies.get("access_token");
      const decoded = jwtDecode(token);
      const userId = decoded._id;

      const product = products.find((p) => p.id === id);
      const newQuantity = product.quantity + change;


      if (newQuantity < 1) {      
        const productId = id;
        await cartService.removeFromCart(userId, productId)
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Item removed from cart");
        return;
      }

    
      if (newQuantity > 5) {
        toast.error("Maximum quantity allowed is 5 items");
        return;
      }

      if (newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }

   
       const productId = id;
      const quantity = change
      await cartService.addToCart(productId, quantity);
      setProducts(
        products.map((product) => {
          if (product.id === id) {
            return { ...product, quantity: newQuantity };
          }
          return product;
        })
      );

      toast.success("Cart updated successfully");
      fetchCartData();
    } catch (error) {     
      if (error.response?.data?.message === "Product is blocked by the admin") {
        toast.error("This product is currently blocked by the admin");
        navigate('/user/home')
        //window.location.reload();
      } else if (
        error.response?.data?.message === "Category is blocked by the admin"
      ) {
        toast.error("This category is currently blocked by the admin");
        navigate('/user/home')
        //window.location.reload();
      } else {
        toast.error(error.response?.data?.message || "Error updating cart");
      }
    }
  };

  const removeItem = async (id) => {
    try {
   
      const token = Cookies.get("access_token");
      const decoded = jwtDecode(token);
      const userId = decoded._id;     
      const productId = id;
      await cartService.removeFromCart(userId, productId);
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Error removing item from cart");
    }
  };

  const goToCheckOutPage = async () => {
    const token = Cookies.get("access_token");
    const decoded = jwtDecode(token);
    const userId = decoded._id;

    try {     
      const response = await cartService.refreshCart(userId);
      if (response.data.success) {
        if (response.data.blockedProducts.length > 0) {
          setBlockedProducts(response.data.blockedProducts);
          setModalVisible(true);
          return;
        } else if (response.data.filteredItems.length === 0) {
          toast.error("No products available in your cart");
        } else {
          navigate("/user/features/cart/checkout");
        }
      }
    } catch (error) {
      toast.error("You are not allowed to access the checkout page, please contact our administrator.");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigate('/user/home');
  };

  const indianCurrencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const percentageDiscount =
    (cartData.totalDiscount / cartData.totalRegularPrice) * 100;
  const deliveryFee = 15;

  const goToProductDetailPage = (productId) => {
    navigate(`/user/product_detail/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
       
        <div className="flex flex-col items-center pt-5 relative">
          <p className="text-xl text-gray-500">Oops! Your cart is empty.</p>
          <img
          onClick={() => navigate("/user/shop")}
            src="/e.png"
            alt="Empty Cart"
            className="w-1/5 h-auto  opacity-90 hover:opacity-100 transition duration-300"
          />
          <button
            onClick={() => navigate("/user/shop")}
            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 transition duration-300 transform hover:scale-105  "
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <h1 className="text-3xl font-bold mb-8">Your cart</h1>

    
      {isModalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
         
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Blocked Products
            </h2>
           
            <ul className="list-none mb-4 space-y-3">
              {blockedProducts.map((product, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <span className="text-gray-700 text-sm font-medium">
                    {product.productName}
                  </span>
                </li>
              ))}
            </ul>

         
            <div className="flex flex-col items-center">
              <img
                className="w-24 h-24 mb-4"
                src="https://static.vecteezy.com/system/resources/previews/023/518/224/non_2x/cartoon-sad-face-plaintive-look-unhappy-vector.jpg"
                alt="Sad face"
              />
              <p className="text-gray-600 text-center mb-4">
                Due to some issues, the admin has blocked
                {blockedProducts.length === 1
                  ? " this product"
                  : " these products"}{" "}
                in your cart. They will no longer be available.
              </p>
            </div>

         
            <button
              onClick={handleModalClose}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`flex flex-col md:flex-row gap-6 p-4  rounded-lg shadow ${
                product.stock > 0 ? "bg-white" : "bg-gray-200"
              }`}
            >
              {product.stock > 0 ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => goToProductDetailPage(product.id)}
                  className="w-full md:w-48 h-48 object-cover rounded-md"
                />
              ) : (
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    onClick={() => goToProductDetailPage(product.id)}
                    className="w-full md:w-48 h-48 object-cover rounded-md"
                  />
                  <p className="absolute left-4 bottom-20 bg-gray-300 py-2 px-1 rounded-sm">
                    Currently Not available
                  </p>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div
                  className="flex justify-between items-start"
                  onClick={() => goToProductDetailPage(product.id)}
                >
                  <div>
                    <h3 className="font-semibold text-lg flex">
                      {product.name}
                      <span className="ml-2 text-gray-600">
                        {product.brand}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      Model: {product.modelNumber}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-semibold text-base line-through text-red-500">
                      {indianCurrencyFormatter
                        .format(product.price)
                        .replace(".00", "")}
                    </div>
                    <div className="font-bold text-lg text-green-500">
                      {indianCurrencyFormatter
                        .format(product.salePrice)
                        .replace(".00", "")}
                    </div>
                  </div>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-2  gap-2 text-sm text-gray-600"
                  onClick={() => goToProductDetailPage(product.id)}
                >
                  <p>Processor: {product.processor}</p>
                  <p>RAM: {product.ram}</p>
                  <p>Storage: {product.storage}</p>
                  <p>Graphics: {product.graphics}</p>
                  <p>Display: {product.display}</p>
                  <p>OS: {product.operatingSystem}</p>
                  <p>Color: {product.color}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{product.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Amount</span>
              <span>
                {indianCurrencyFormatter.format(cartData.totalRegularPrice)}
              </span>
            </div>

            <div className="flex justify-between text-green-500">
              <span>Discount (-{percentageDiscount.toFixed(2)}%)</span>
              <span>
                - {indianCurrencyFormatter.format(cartData.totalDiscount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{indianCurrencyFormatter.format(deliveryFee)}</span>
            </div>

            <div className="border-t pt-4 font-bold flex justify-between text-lg">
              <span>Total</span>
              <span>
                {indianCurrencyFormatter.format(
                  cartData.netTotal + deliveryFee
                )}
              </span>
            </div>



            {/* <div className="flex gap-2 mt-6">
              <input
                type="text"
                placeholder="Add coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Apply
              </button>
            </div> */}



            <button
              onClick={goToCheckOutPage}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-gray-800 mt-6"
            >
              Go to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
}

