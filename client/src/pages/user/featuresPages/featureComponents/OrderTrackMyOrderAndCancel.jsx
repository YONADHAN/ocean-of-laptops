import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, X, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "../../../../api/axiosConfig";
import { orderService } from "../../../../apiServices/userApiServices";
import ConfirmationAlert from "../../../../components/MainComponents/ConformationAlert";
import ReasonMessageBox from "../../../../components/MainComponents/reasonMessageBox";








// Separate Modal component with Tailwind styling
const PaymentModal = ({ isOpen, onClose, message, success }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full m-4">
        <div className={`text-center mb-4 ${success ? 'text-green-600' : 'text-red-600'}`}>
          <p className="text-lg font-semibold">{message}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom hook for payment handling
const usePaymentHandler = (orderId) => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    success: false
  });

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (modalState.success) {
      navigate(`/user/features/cart/checkout/confirmation/${orderId}`);
    }
  };

  const getTaxInvoice = async()=> {
    const response = await axiosInstance.get(`/get_tax_invoice/${orderId}`);
    if (!response) {
      toast.error("Tax invoice not found. Please try again.");
      return;
    }
  }

  const handlePayment = async () => {
    try {
      const order = await axiosInstance.get(`/get_order/${orderId}`);
      if (!order) {
        toast.error("Order not found. Please try again.");
        return;
      }

      const paymentStatus = order.data.order.paymentStatus;
      const shippingAddress = order.data.order.shippingAddress;

      if (paymentStatus === "Completed") {
        setModalState({
          isOpen: true,
          message: "Payment already completed.",
          success: true
        });
        return;
      }

      const { data: razorpayOrder } = await axiosInstance.post("/retry_payment", { orderId });
      if (!razorpayOrder.id) {
        setModalState({
          isOpen: true,
          message: "Failed to create a new Razorpay order.",
          success: false
        });
        return;
      }

      const options = {
        key: "rzp_test_2aUGLgE6VrGTVa",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "LaptopHub",
        description: "Retrying payment for your order",
        order_id: razorpayOrder.id,
        retry: { enabled: false },
        handler: async (response) => {
          try {
            const verifyRes = await axiosInstance.post("/verify_razorpay_payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setModalState({
              isOpen: true,
              message: verifyRes.data.success ? "Payment successful!" : "Payment verification failed.",
              success: verifyRes.data.success
            });

          } catch (err) {
            console.error("Error verifying payment:", err);
            setModalState({
              isOpen: true,
              message: "Error during payment verification.",
              success: false
            });
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: { color: "#3399cc" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setModalState({
          isOpen: true,
          message: "Payment failed. Please try again.",
          success: false
        });
      });

    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      setModalState({
        isOpen: true,
        message: "Failed to initialize Razorpay. Please try again.",
        success: false
      });
    }
  };

  return { handlePayment, modalState, closeModal };
};


const handleDownloadInvoice = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/get_tax_invoice/${orderId}`, {
      responseType: 'arraybuffer',  // Important! This tells axios to handle binary data
      headers: {
        'Accept': 'application/pdf'
      }
    });

    if (!response.data || response.data.byteLength === 0) {
      toast.error("Tax invoice not found. Please try again.");
      return;
    }

    // Create blob from array buffer
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Create download link
    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `invoice_${orderId}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(fileURL);
    
    toast.success("Tax invoice downloaded successfully.");
  } catch (error) {
    console.error("Error downloading invoice:", error);
    
    // Better error handling
    if (error.response) {
      if (error.response.status === 403) {
        toast.error("Invoice can only be downloaded for delivered orders.");
      } else if (error.response.status === 404) {
        toast.error("Invoice not found.");
      } else {
        toast.error("Failed to download invoice. Please try again later.");
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
  }
};





const OrderTrackingPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showProductAlert, setShowProductAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [order, setOrder] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [reason, setReason] = useState("");
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [showRazorPayModal, setShowRazorPayModal] = useState(false);
  const [modalData, setModalData] = useState({ success: false, message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { handlePayment, modalState, closeModal } = usePaymentHandler(orderId);
  useEffect(() => {
    const fetchSampleOrder = async () => {
      const response = await orderService.getOrder(orderId);
      setOrder(response.data.order);
    };

    fetchSampleOrder();
  }, [orderId, selectedProduct]);

  if (!order) {
    return <div>Loading order details...</div>;
  }

  const handleCancel = () => {
    setShowAlert(false);
    setShowProductAlert(false);
    setSelectedProduct(null);
  };

  const handleProceed = async () => {
    try {
      const response = await axiosInstance.get(`/cancel_order/${orderId}`);
      if (response.status === 200) {
        toast.success("Order cancelled successfully");
        navigate("/user/features/order");
      }
    } catch (error) {
      toast.error("Order cancellation failed");
    }
    setShowAlert(false);
  };

  const handleProductCancel = async () => {
    try {
      const productId = selectedProduct._id;
      const quantity = selectedProduct.quantity;
      const response = await orderService.cancelProduct(
        orderId,
        productId,
        quantity
      );
      if (response.status === 200) {
        toast.success("Product cancelled successfully");
        const updatedOrder = await orderService.getOrder(orderId);
        setOrder(updatedOrder.data.order);
      }
    } catch (error) {
      toast.error("Product cancellation failed");
    }
    setShowProductAlert(false);
    setSelectedProduct(null);
  };

  const handleSubmitReason = (reasonText) => {
    if (reasonText.trim() == "") {
      toast.error(
        "Please enter a reason before submitting your return request."
      );
      return;
    }
    if (reasonText.split("").length < 10) {
      toast.error("Reason should contain more than 10 words");
      return;
    }
    setReason(reasonText);
    setShowReasonBox(false);
    setShowAlert(true);
  };

  const handleSubmitProductReason = (reasonText) => {
    if (reasonText.trim() == "") {
      toast.error(
        "Please enter a reason before submitting your return request."
      );
      return;
    }
    if (reasonText.split("").length < 10) {
      toast.error("Reason should contain more than 10 words");
      return;
    }
    setReason(reasonText);
    setShowReasonBox(false);
    setShowProductAlert(true);
  };

  const handleCancelOrder = () => {
    setShowReasonBox(true);
  };

  const handleCancelProduct = (product) => {
    setSelectedProduct(product);
    setShowReasonBox(true);
  };

  const handleReturnRequest = async (reason) => {
    try {
      if (reason.trim() == "") {
        toast.error(
          "Please enter a reason before submitting your return request."
        );
        return;
      }
      if (reason.split("").length < 10) {
        toast.error("Reason should contain more than 10 words");
        return;
      }
      const response = await axiosInstance.post("/return_product", {
        orderId: orderId,
        productId: selectedProduct._id,
        reason: reason,
      });

      if (response.status === 200) {
        toast.success("Return request submitted successfully");
        const updatedOrder = await orderService.getOrder(orderId);
        setOrder(updatedOrder.data.order);
      }
    } catch (error) {
      toast.error("Failed to submit return request");
    }
    setShowReturnModal(false);
    setSelectedProduct(null);
  };

  const handleReturnModalClose = () => {
    setShowReturnModal(false);
    setSelectedProduct(null);
  };

  const getTimelineStatus = (status) => {
    const stages = {
      Pending: 0,
      Placed: 1,
      Shipped: 2,
      Delivered: 3,
      Cancelled: -1,
      Returned: -1,
      "Return Rejected": -1,
    };
    return stages[status] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const goToProductDetailPage = (productId) => {
    navigate(`/user/product_detail/${productId}`);
  };

  const handleRetryPayment = async () => {
    try {
      // Pass the state setters to razorpayCheckout
      await razorpayCheckout(orderId, setModalData, setIsModalOpen);
    } catch (error) {
      console.error("Error during payment retry:", error);
      setModalData({
        success: false,
        message: "Failed to initialize payment. Please try again.",
      });
      setIsModalOpen(true);
      toast.error("Failed to retry payment. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalData.success) {
      navigate(`/confirmation/${orderId}`);
    }
  };

  const steps = [
    { name: "Pending", icon: Package },
    { name: "Placed", icon: Package },
    { name: "Shipped", icon: Truck },
    { name: "Delivered", icon: CheckCircle },
  ];

  const currentStatus = getTimelineStatus(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header section */}
        <div className="mb-6 flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/user/features/order")}
          >
            <button className="rounded-full p-2 hover:bg-blue-100 text-blue-600">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-blue-800">
              ORDER DETAILS
            </h2>
          </div>
          {order.orderStatus !== "Delivered" &&
            order.orderStatus !== "Cancelled" && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
               
                onClick={handleCancelOrder}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Order
              </button>
            )}
            {
              order.orderStatus === 'Delivered'  && (
                <button className="px-4 py-1 bg-black text-white" onClick={()=>handleDownloadInvoice(orderId)}>
                  Download Invoice
                </button>
              )
            }
        </div>

        {/* Main content */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          {/* Order header */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-800">
                #{order.orderId}
              </h2>
              <p className="text-sm text-gray-600">
                {order.orderItems.length} Products • Order Placed on{" "}
                {formatDate(order.placedAt)}
              </p>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {order.totalAmount.toLocaleString() ===
              calculateTotal(order.orderItems).toLocaleString() ? (
                <p>₹{order.totalAmount.toLocaleString()}</p>
              ) : (
                <>
                  <div className="text-gray-400">
                    Ordered Amount: ₹
                    {calculateTotal(order.orderItems).toLocaleString()}
                  </div>
                  <div>
                    Now Payable: ₹{order.payableAmount.toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order status tracking */}
          <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex">
              Order Status{" "}
              <div className="text-red-600">
                {order.orderStatus === "Cancelled" ? "( Cancelled )" : ""}
              </div>
            </h3>
            <div className="relative">
              <div className="absolute left-0 top-[25px] transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
              <div
                className="absolute left-0 top-[25px] transform -translate-y-1/2 h-1 bg-blue-500 transition-all duration-500 ease-in-out"
                style={{
                  width: `${(currentStatus / (steps.length - 1)) * 100}%`,
                }}
              ></div>
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStatus;
                  const isCompleted = index < currentStatus;

                  return (
                    <div key={step.name} className="flex flex-col items-center">
                      <div
                        className={`z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                          isActive
                            ? "bg-blue-500 border-blue-500"
                            : "bg-white border-gray-200"
                        } transition-all duration-500 ease-in-out`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p
                          className={`text-sm font-medium ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {step.name}
                        </p>
                        {isCompleted && (
                          <span className="text-xs text-green-500">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products table */}
          <div className="mb-8">
            <h3 className="mb-4 font-semibold text-blue-800">Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 text-sm">
                  <tr>
                    <th className="py-3 px-4 text-left">PRODUCTS</th>
                    <th className="py-3 px-4 text-right">PRICE</th>
                    <th className="py-3 px-4 text-right">QUANTITY</th>
                    <th className="py-3 px-4 text-right">DISCOUNT</th>
                    <th className="py-3 px-4 text-right">TOTAL</th>
                    <th className="py-3 px-4 text-right">STATUS</th>
                    <th className="py-3 px-4 text-center">ACTIVITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.orderItems &&
                    order.orderItems.map((item, index) => (
                      <tr key={index} className="hover:bg-blue-50">
                        <td
                          className="py-4 px-4"
                          onClick={() => goToProductDetailPage(item.product)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 flex-shrink-0 rounded-lg">
                              <img
                                src={item.productImage}
                                alt=""
                                className="object-contain w-full h-full"
                              />
                            </div>
                            <span className="font-medium">
                              {item.productName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {item.discount}%
                        </td>
                        <td className="py-4 px-4 text-right">
                          ₹{item.totalPrice.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 font-medium">
                            {item.orderStatus}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          {/* Cancel button logic */}
                          {item.orderStatus !== "Cancelled" &&
                            item.orderStatus !== "Delivered" && (
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-1 text-sm font-medium"
                                // onClick={() => {
                                //   setSelectedProduct(item);
                                //   setShowProductAlert(true);
                                // }}
                                onClick={() => {
                                  handleCancelProduct(item);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                <span>Cancel</span>
                              </button>
                            )}

                          {/* Return button logic */}
                          {item.orderStatus === "Delivered" &&
                            (!item.returnRequest?.requestStatus ||
                              (item.returnRequest.requestStatus !==
                                "Approved" &&
                                item.returnRequest.requestStatus !==
                                  "Rejected")) && (
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-1 text-sm font-medium"
                                onClick={() => {
                                  setSelectedProduct(item);
                                  setShowReturnModal(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                                <span>
                                  Return{" "}
                                  {item.returnRequest?.requestStatus ===
                                  "Pending"
                                    ? "Request Applied"
                                    : ""}
                                </span>
                              </button>
                            )}

                          {/* Return approved badge */}
                          {item.returnRequest?.requestStatus === "Approved" && (
                            <div className="inline-flex items-center px-3 py-1 rounded-md bg-green-500 text-white text-sm font-medium">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>Return Approved</span>
                            </div>
                          )}

                          {/* Return rejected badge */}
                          {item.returnRequest?.requestStatus === "Rejected" && (
                            <div className="inline-flex items-center px-3 py-1 rounded-md bg-red-500 text-white text-sm font-medium">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span>Return Rejected</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50">
            <div className="container mx-auto p-4 md:p-6">
              {order &&
                order.paymentStatus === "Pending" &&
                order.paymentMethod === "Razor pay" && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-500 text-center mb-4">
                      Your payment status is pending. Please complete the
                      payment to avoid order cancellation. If you failed to pay
                      within 2 days after placing the order, the order gets
                      automatically cancelled.
                    </p>
                    <div className="w-full flex justify-center">
                      <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={handlePayment}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                )}

              <PaymentModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                message={modalState.message}
                success={modalState.success}
              />
            </div>
          </div>

          {/* Address and summary section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-800">Shipping Address</h3>
              <div className="space-y-1 text-sm bg-blue-50 p-4 rounded-lg">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.address}
                  {order.shippingAddress.landmark &&
                    `, ${order.shippingAddress.landmark}`}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.district}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
                <p>Email: {order.shippingAddress.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-800">Order Summary</h3>
              <div className="space-y-2 text-sm bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ₹
                    {(
                      order.orderedAmount +
                      order.totalDiscount -
                      15
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Offer Discount</span>
                  <span>-₹{order.totalDiscount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Coupon</span>
                  <span>-₹{order.couponDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>+₹{order.shippingFee}</span>
                </div>

                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>
                    ₹{(order.totalAmount + order.shippingFee).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-blue-800 text-lg pt-2 border-t">
                  <span>Payable Amount</span>
                  <span>
                    ₹
                    {(
                      order.payableAmount +
                      (order.payableAmount === 0 ? 0 : order.shippingFee)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-gray-600">
                    Payment Method: {order.paymentMethod}
                  </p>
                  <p className="text-gray-600">
                    Payment Status: {order.paymentStatus}
                  </p>
                  <p className="text-gray-600">
                    Expected Delivery: {formatDate(order.deliveryBy)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showReasonBox && (
          <ReasonMessageBox
            title="Reason for Cancellation"
            placeholder="Please provide a reason for cancellation..."
            onSubmit={
              selectedProduct ? handleSubmitProductReason : handleSubmitReason
            }
            onClose={() => setShowReasonBox(false)}
          />
        )}

        {/* Confirmation Alerts */}
        <ConfirmationAlert
          show={showAlert}
          title={<div className="text-center">Cancel Order</div>}
          message={
            <div className="bg-gray-200 p-4 rounded-lg">
              <p className="text-blue-500 text-center text-md">
                We got your reason
              </p>
              <p className=" w-full min-h-16 py-3">{reason}</p>
              <p className="text-red-500 ">
                Are you sure that you want to cancel your entire order?
              </p>
            </div>
          }
          onCancel={handleCancel}
          onProceed={handleProceed}
          noText="No, Keep Order"
          yesText="Yes, Cancel Order"
        />
        <ConfirmationAlert
          show={showProductAlert}
          title={<div className="text-center">Cancel Product</div>}
          message={
            <div className="bg-gray-200 p-4 rounded-lg">
              <p className="text-blue-500 text-center text-md">
                We got your reason
              </p>
              <p className=" w-full min-h-16 py-3">{reason}</p>
              <p className="text-red-500 ">
                Are you sure you want to cancel{" "}
                {selectedProduct?.productName || "this product"}?
              </p>
            </div>
          }
          onCancel={handleCancel}
          onProceed={handleProductCancel}
          noText="No, Keep Product"
          yesText="Yes, Cancel Product"
        />

        {/* Return Reason Modal */}
        {showReturnModal && (
          <ReasonMessageBox
            title="Return Product"
            onSubmit={handleReturnRequest}
            onClose={handleReturnModalClose}
            submitKey="Submit Return Request"
            closeKey="Cancel"
            placeholder="Please provide a reason for returning this product..."
          />
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
