import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "../../../../api/axiosConfig";
import {orderService} from "../../../../apiServices/userApiServices"
import ConfirmationAlert from "../../../../components/MainComponents/ConformationAlert";

const OrderTrackingPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showProductAlert, setShowProductAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    const fetchSampleOrder = async () => {
      // const response = await axiosInstance.get(`/get_order/${orderId}`);
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
      //const response = await orderService.cancelOrder(orderId);
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
      console.log(
        "Product cancelled , orderId: " + orderId,
        " productId: " + selectedProduct._id,
        " quantity: " + selectedProduct.quantity
      );
      const productId = selectedProduct._id;
      const quantity = selectedProduct.quantity;
      const response =await orderService.cancelProduct(orderId, productId, quantity);
      // const response = await axiosInstance.post(`/cancel_product`, {
      //   orderId: orderId,
      //   productId: selectedProduct._id,
      //   quantity: selectedProduct.quantity,
      // });
      if (response.status === 200) {
        toast.success("Product cancelled successfully");
        // const updatedOrder = await axiosInstance.get(`/get_order/${orderId}`);
        const updatedOrder = await orderService.getOrder(orderId);
        setOrder(updatedOrder.data.order);
      }
    } catch (error) {
      toast.error("Product cancellation failed");
    }
    setShowProductAlert(false);
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
                onClick={() => setShowAlert(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Order
              </button>
            )}
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
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
                <>
                  <p>₹{order.totalAmount.toLocaleString()}</p>
                </>
              ) : (
                <>
                  <div className="text-gray-400">
                    Ordered Amount:{" "}
                    <span>
                      ₹{calculateTotal(order.orderItems).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Now Payable:{" "}
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Improved Order Status Tracking */}
          <div className="w-full  mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex">
              Order Status{" "}
              <div className="text-red-600">
                {order.orderStatus == "Cancelled" ? "( Cancelled )" : ""}
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
                    <th className="py-3 px-4 text-right">ACTIVITY</th>
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
                          {item.orderStatus !== "Cancelled" &&
                            item.orderStatus !== "Delivered" && (
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full flex items-center font-medium text-sm"
                                onClick={() => {
                                  setSelectedProduct(item);
                                  setShowProductAlert(true);
                                }}
                              >
                                +Cancel
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

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
                  ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>₹{order.shippingFee}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Total Discount</span>
                  <span>₹{order.totalDiscount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coupon Discount</span>
                  <span>₹{order.couponDiscount}</span>
                </div> */}
                <div className="flex justify-between font-bold text-blue-800 text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{(order.totalAmount+order.shippingFee).toLocaleString()}</span>
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

        <ConfirmationAlert
          show={showAlert}
          title="Cancel Order"
          message="Are you sure you want to cancel the entire order?"
          onCancel={handleCancel}
          onProceed={handleProceed}
          noText="No, Keep Order"
          yesText="Yes, Cancel Order"
        />

        <ConfirmationAlert
          show={showProductAlert}
          title="Cancel Product"
          message={`Are you sure you want to cancel ${
            selectedProduct?.productName || "this product"
          }?`}
          onCancel={handleCancel}
          onProceed={handleProductCancel}
          noText="No, Keep Product"
          yesText="Yes, Cancel Product"
        />
      </div>
    </div>
  );
};

export default OrderTrackingPage;
