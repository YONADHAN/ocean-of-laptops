import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../../../../api/axiosConfig";
import {
  cartService,
  authService,
  checkoutService,
} from "../../../../apiServices/userApiServices";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AddAddress from "../../../../pages/user/featuresPages/featureComponents/AccountAddressManagementAddAddress";
import EditAddress from "../../../../pages/user/featuresPages/featureComponents/AccountAddressManagementEditAddress";
import CouponCard from "../../../../components/UserComponents/coupons/couponCard";
import PaymentFailure from "../../../../pages/others/PaymentFailure";
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("false");
  const [showEditAddressForm, setShowEditAddressForm] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentFailureModal, setPaymentFailureModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({})

  const toggleModal = () => setPaymentFailureModal(!paymentFailureModal);

  const navigate = useNavigate();
  useEffect(() => {
    fetchAddresses();
    fetchCart();
    fetchCartData();
    fetchWalletBalance();
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
      const response = await cartService.getCart({ userId });
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

  const fetchWalletBalance = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const decoded = jwtDecode(token);

      const userId = decoded._id;
      const wallet = await axiosInstance.post("/wallet_balance", { userId });
      if (wallet.status === 200) {
        toast.success("Wallet balance fetched successfully");
        setWalletBalance(wallet.data.balance);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      // toast.error("Failed to fetch wallet balance");
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
      toast.error(
        "You are not allowed to place order on this account. Please contact our administrator."
      );
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
        
    try {
      const res = await cartRefresh();
      if (res.data.blockedProducts?.length > 0) {
        setBlockedProducts(res.data.blockedProducts);
        setModalVisible(true);
        return;
      }

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
        paymentStatus,
        shippingFee: 15,
        orderedAmount: cartData.netTotal + 15 || 0,
        totalAmount: finalAmount > 0 ? finalAmount : cartData.netTotal || 0,
        totalDiscount: cartData.totalDiscount,
        couponDiscount: couponDiscount || 0,
      };

      setLoading(true);

      if (paymentMethod === "Razor pay") {
        try {
          const { data: razorpayOrder } = await axiosInstance.post(
            "/create_razorpay_order",
            {
               amount: orderData.totalAmount,
            }
          );

          const options = {
            key: "rzp_test_2aUGLgE6VrGTVa",
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Ocean of Laptop",
            description: "Payment for order",
            order_id: razorpayOrder.id,
            retry: {
              enabled: false,
            },
            handler: async function (response) {
              try {
                const verifyRes = await axiosInstance.post(
                  "/verify_razorpay_payment",
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }
                );

                if (verifyRes.data.success) {
                  orderData.razorpayPaymentId = response.razorpay_payment_id;
                  orderData.paymentStatus = "Completed";
                  const finalOrder = await checkoutService.checkout(orderData);
                  if (finalOrder.status === 200) {
                    toast.success("Order placed successfully");
                    navigate(`confirmation/${finalOrder.data.orderId}`);
                    clearCart();
                  }
                } else {                 
                  console.log("Payment verification failed")
                  setPaymentFailureModal(true);
                }
              } catch (err) {
                console.error("Error verifying payment:", err);              
                setPaymentFailureModal(true);
              }
            },
            prefill: {
              name: selectedAddress.name,
              email: selectedAddress.email,
              contact: selectedAddress.phone,
            },
            notes: {
              address: `${selectedAddress.areaStreet}, ${selectedAddress.city}`,
            },
            theme: {
              color: "#3399cc",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", async function (response) {
            orderData.razorpayPaymentId =  response.razorpay_payment_id
            orderData.paymentStatus = "Pending";
            const finalOrder = await checkoutService.checkout(orderData);//-----------------------------------------added to successfully save the order
            console.log(orderData)
            if (finalOrder.status === 200) {
              toast.success("Order placed successfully");
              // navigate(`confirmation/${finalOrder.data.orderId}`);
              clearCart();
            }
          
            console.log("finalOrder placed successfully", finalOrder);
            const orderId = finalOrder.data.orderId;
            const mongodbId = finalOrder.data.orderData._id;
            setOrderDetails({orderId,mongodbId});
            setPaymentFailureModal(true);
            clearCart();
          });

          rzp.open();
        } catch (error) {
          console.error("Error initializing Razorpay:", error);
          toast.error("Failed to initialize payment");
        }
      } else {
        orderData.paymentStatus = "Completed";
        const finalOrder = await checkoutService.checkout(orderData);
        if (finalOrder.status === 200) {
          toast.success("Order placed successfully");
          console.log("final order data: " + finalOrder);
          navigate(`confirmation/${finalOrder.data.orderId}`);
          clearCart();
        }
      }

      try {
        const coupon = await axiosInstance.post("/apply_coupon_ultimate", {
          userId: decoded._id,
          couponCode: appliedCouponCode,
        });
      } catch (error) {}
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };



  
  // const orderDetails = {
  //   orderId: "ORD12345",
  //   itemName: "Example Product",
  // };


  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
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

  const handleCouponApply = (discount, code) => {
    setCouponDiscount(discount);
    setAppliedCouponCode(code);
    setFinalAmount(cartData.netTotal - discount);
    setAppliedCoupon(true);
  };
  const handleCouponClear = () => {
    setCouponDiscount(0);
    setAppliedCouponCode("");
    setFinalAmount(cartData.netTotal);
    setAppliedCoupon(false);
  };

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
        {/* <button
          className="px-4 py-1 bg-blue-500 rounded-lg text-white"
          onClick={() => {
            setShowEditAddressForm(true);
            setSelectedAddress(data);
          }}
        >
          Edit
        </button> */}
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

  if (showEditAddressForm) {
    return (
      <div>
        <EditAddress
          redirectToCheckout={true}
          onSuccess={handleSuccess}
          addressId={selectedAddress._id}
        />
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

      {paymentFailureModal && (
        <PaymentFailure
          isOpen={paymentFailureModal}
          onClose={toggleModal}
          orderDetails={orderDetails}
        />
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
                  <div className="flex justify-between w-full">
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <p className="text-sm text-gray-600">
                        {method.id === "Cash on Delivery"
                          ? "Pay when you receive your order"
                          : `Pay securely with ${method.label}`}
                      </p>
                    </div>
                    <div >
                      {method.id === "wallet" && <div className="flex text-nowrap"> Current Balance is :<div className="font-bold">{ formatCurrency(walletBalance)}</div></div>}
                    </div>
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
                <span>Offer :</span>
                <span>
                  -
                  {indianCurrencyFormatter.format(
                    cartData.globalDiscount?.toFixed(2) || "0.00"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Coupon Discount:</span>
                <span>
                  -{indianCurrencyFormatter.format(Number(couponDiscount))}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping Fee:</span>
                <span>₹15.00</span>
              </div>
              {/* <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  {indianCurrencyFormatter.format(
                    (cart.finalTotal + 15 - couponDiscount||0).toFixed(2)
                  )}
                  
                </span>
              </div> */}
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  {indianCurrencyFormatter.format(
                    finalAmount > 0
                      ? (finalAmount + 15).toFixed(2)
                      : (cartData.netTotal + 15).toFixed(2)
                  )}
                </span>
              </div>

              <CouponCard
                totalAmount={cartData.netTotal}
                onApplyCoupon={handleCouponApply}
                onClearCoupon={handleCouponClear}
              />
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
