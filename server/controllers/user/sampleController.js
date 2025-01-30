const handlePlaceOrder = async () => {
  if (paymentMethod === "Razor pay") {
    try {
      setLoading(true);

      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      const token = Cookies.get("access_token");
      const decoded = jwtDecode(token);

      // Fetch Razorpay order from backend
      const response = await axiosInstance.post("/create-order", {
        amount: finalAmount > 0 ? finalAmount : cartData.netTotal,
      });

      const { id: order_id, amount, currency } = response.data;

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
        amount: amount,
        currency: currency,
        name: "Your Shop Name",
        description: "Order Payment",
        order_id: order_id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // Verify payment on backend
          const verifyResponse = await axiosInstance.post("/verify-payment", {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          });

          if (verifyResponse.data.success) {
            toast.success("Payment successful! Placing your order...");
            await placeOrder();
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: decoded.name,
          email: decoded.email,
          contact: decoded.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error with Razorpay payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setLoading(false);
    }
  } else {
    // Handle other payment methods
    await placeOrder();
  }
};

const placeOrder = async () => {
  try {
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
      shippingAddress: { ...selectedAddress },
      paymentMethod,
      paymentStatus: "Paid",
      shippingFee: 15,
      orderedAmount: finalAmount > 0 ? finalAmount + 15 : cartData.netTotal + 15,
      totalDiscount: cartData.totalDiscount,
      couponDiscount: couponDiscount || 0,
    };

    const response = await checkoutService.checkout(orderData);
    if (response.status === 200) {
      toast.success("Order placed successfully");
      navigate(`/confirmation/${response.data.orderId}`);
      clearCart();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to place order");
  }
};
