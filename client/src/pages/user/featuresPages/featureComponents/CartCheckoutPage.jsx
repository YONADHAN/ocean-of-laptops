import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../../../../api/axiosConfig";
import {cartService, authService, checkoutService} from '../../../../apiServices/userApiServices'
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AddAddress from "../../../../pages/user/featuresPages/featureComponents/AccountAddressManagementAddAddress";
const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [withAddresses, setWithAddresses] = useState(false);
  const [cartData, setCartData] = useState({});
  const [blockedProducts, setBlockedProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showAddressForm, setAddressForm] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAddresses();
    fetchCart();
    fetchCartData();
  }, [navigate]);
  const fetchCartData = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        navigate("/user/signin");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded._id;

      //const response = await axiosInstance.post("/cart_data", { userId });//--------------------------------
      const response = await cartService.getCartData(userId);
      if (response.status === 200 && response.data.success) {
        setCartData(response.data.cart);
      
      } else {
        toast.error(response.data.message || "Failed to fetch cart data");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to fetch cart data");
    }
  };

  const fetchCart = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const decoded = jwtDecode(token);
     
      const userId = decoded._id;
       const response = await cartService.getCart({userId});
      if (!response.data.success) {
        toast.error(response.data.message || "Failed to fetch cart");
        setCart({ items: [], subTotal: 0, finalTotal: 0 });
        return;
      }

      setCart(response.data.cart);
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      setCart({ items: [], subTotal: 0, finalTotal: 0 });
    }
  };

  const goToAddAddresses = () => {
    setWithAddresses(true);
    setAddressForm(true);
   
  };
  const handleSuccess = () => {
    setAddressForm(false);
    window.location.reload();
  };

  const fetchAddresses = async () => {
    setAddressesLoading(true);
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }
      const decoded = jwtDecode(token);
      const response = await axiosInstance.get(
        `/addresses_get?userId=${decoded._id}`
      );
      if (response.data.addresses) {
        const sortedAddresses = response.data.addresses.sort((a, b) => {
          if (a.default && !b.default) return -1;
          if (!a.default && b.default) return 1;
          return 0;
        });

        setAddresses(sortedAddresses);
        const defaultAddress =
          sortedAddresses.find((addr) => addr.default) || sortedAddresses[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
      setWithAddresses(true);
    } catch (error) {
      setWithAddresses(false);
      toast.error("Add Address");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    console.log("Address selected is " + address);
    setSelectedAddress(address);
  };

  const cartRefresh = async () => {
    const token = Cookies.get("access_token");
    const decoded = jwtDecode(token);
    const userId = decoded._id;
    try {
      const response = await axiosInstance.post("/refresh_cart", { userId });
   
      if (response.data.success) {
        toast.success("Cart refreshed successfully");
      }
     
      return response; 
    } catch (error) {
      toast.error("You are not allowed to place order on this account. Please contact our administrator.");
      throw error; 
    }
  };

  const indianCurrencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const handleModalClose = async () => {
    setModalVisible(false);
    navigate("/user/home");
  };
  const handlePlaceOrder = async () => {
    const res = await cartRefresh();
    if (res.data.blockedProducts && res.data.blockedProducts.length > 0) {
      setBlockedProducts(res.data.blockedProducts);
      setModalVisible(true);
      return;
    }

    if (paymentMethod === "Cash on Delivery") {
      setPaymentStatus("Pending");
    }
    try {
      setLoading(true);
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      const token = Cookies.get("access_token");
      const decoded = jwtDecode(token);

      const orderData = {
        user: decoded._id,
        orderItems: cart.items.map((item) => ({
          product: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          discount: item.discount || 0,
        })),
        shippingAddress: {
          name: selectedAddress.name || "N/A",
          email: selectedAddress.email || "N/A",
          phone: selectedAddress.phone || "N/A",
          pincode: selectedAddress.pincode,
          flatHouseNo: selectedAddress.flatHouseNo,
          areaStreet: selectedAddress.areaStreet,
          landmark: selectedAddress.landmark || "",
          city: selectedAddress.city,
          district: selectedAddress.district,
          state: selectedAddress.state,
          country: selectedAddress.country || "India",
          addressType: selectedAddress.addressType,
          deliveryInstructions: selectedAddress.deliveryInstructions || "",
          isDefault: selectedAddress.isDefault || false,
        },
        paymentMethod,
        shippingFee: 15,
        totalAmount: cartData.netTotal || 0,
        totalDiscount: cartData.totalDiscount,
        couponDiscount: 0,
        paymentStatus,
      };

     
      const response = await checkoutService.checkout(orderData);
      if (response.status === 200) {
        toast.success("Order placed successfully");
        navigate(`confirmation/${response.data.orderId}`);
        clearCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], totalAmount: 0 });
  };

  if (addressesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const AddressForm = ({ data }) => (
    <div
      className={`p-4 border rounded-lg mb-3 cursor-pointer transition-all duration-200 ${
        selectedAddress?._id === data._id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => handleAddressSelect(data)}
    >
      <div className="flex items-start">
        <input
          type="radio"
          checked={selectedAddress?._id === data._id}
          onChange={() => handleAddressSelect(data)}
          className="mt-1 mr-4"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{data.flatHouseNo}</h3>
            {data.default && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Default Address
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {data.areaStreet}
            <br />
            {data.city}, {data.state} {data.pincode}
            <br />
            India
          </p>
          <p className="text-sm text-gray-600 mt-1">Phone: {data.phone}</p>
        </div>
      </div>
    </div>
  );

  if (!withAddresses) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center">
          <p className="text-gray-800 text-lg font-semibold mb-0">
            No addresses found.
          </p>
          <img src="/Address.jpg" alt="" />
          <p className="text-gray-600 mb-6">
            Please add an address in your profile to proceed.
          </p>
          <button
            onClick={goToAddAddresses}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-md transition duration-200"
          >
            Add Address
          </button>
        </div>
      </div>
    );
  }

  if (showAddressForm) {
    return (
      <div>
        <AddAddress redirectToCheckout={true} onSuccess={handleSuccess} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Blocked Products
            </h2>

            {/* Blocked Products List */}
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

            {/* Sad Face Illustration */}
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
                in your cart. They will no longer be available.Please have a
                look at your cart
              </p>
            </div>

            {/* Action Button */}
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
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              <button
                className="text-white rounded-md hover:text-blue-700 px-3 py-2 bg-blue-500"
                onClick={goToAddAddresses}
              >
                Add Address
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
              {addresses.map((address) => (
                <AddressForm key={address._id} data={address} />
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: "Cash on Delivery", label: "Cash on Delivery" },
                { id: "Razor pay", label: "Razorpay" },
                { id: "wallet", label: "Wallet" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    paymentMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="mt-1 mr-4"
                  />
                  <div>
                    <div className="font-medium">{method.label}</div>
                    <p className="text-sm text-gray-600">
                      {method.id === "Cash on Delivery"
                        ? "Pay when you receive your order"
                        : `Pay securely with ${method.label}`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 border-t pt-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>
                  {indianCurrencyFormatter.format(cart.subTotal?.toFixed(2))}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>
                  -
                  {indianCurrencyFormatter.format(
                    cartData.globalDiscount?.toFixed(2) || "0.00"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping Fee:</span>
                <span>₹15.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  {indianCurrencyFormatter.format(
                    (cart.finalTotal + 15).toFixed(2)
                  )}
                </span>
              </div>
            </div>
            <button
              className="w-full mt-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 font-medium disabled:opacity-50"
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
