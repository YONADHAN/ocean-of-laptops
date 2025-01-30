import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosConfig";
import { orderService } from "../../../apiServices/adminApiServices";
import { toast } from "sonner";
import ConfirmationAlert from "../../MainComponents/ConformationAlert";

const AdminOrderDetails = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  const [
    showReturnRequestConfirmationModal,
    setReturnRequestConfirmationModal,
  ] = useState(false);
  const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);

  const { orderId } = useParams();

  const fetchOrder = async () => {
    try {
      const { data } = await orderService.getOrderDetails(orderId);
      if (data.success) {
        setOrderData(data.order);
      } else {
        throw new Error(data.message || "Failed to fetch order details");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getStatusConfirmationMessage = (newStatus) => {
    const messages = {
      Cancelled:
        "Are you sure you want to cancel this order? This action cannot be undone.",
      Shipped: "Are you sure you want to mark this order as shipped?",
      Delivered: "Are you sure you want to mark this order as delivered?",
      Pending: "Are you sure you want to change the order status to pending?",
      Placed: "Are you sure you want to change the order status to placed?",
    };
    return (
      messages[newStatus] ||
      `Are you sure you want to change the order status to ${newStatus}?`
    );
  };

  const handleReturnRequestView = async (returnRequest, itemId) => {
    setSelectedReturnRequest({
      ...returnRequest,
      itemId,
    });
    
    setReturnRequestConfirmationModal(true);
  };
  
  const handleReturnRequestAction = async (decision) => {
    if (!selectedReturnRequest) return;

    try {
      setUpdating(true);
      console.log("handleReturnRequest", decision);
      console.log("handleReturnRequest", selectedReturnRequest);
      const response = await axiosInstance.post(
        "/admin/return_request_management",
        {
          orderId,
          itemId: selectedReturnRequest.itemId,
          decision,
          reason: selectedReturnRequest.reason,
        }
      );

      if (response.data.success) {
        setOrderData((prevData) => ({
          ...prevData,
          orderItems: prevData.orderItems.map((item) => {
            if (item.product === selectedReturnRequest.itemId) {
              return {
                ...item,
                returnRequest: {
                  ...item.returnRequest,
                  requestStatus:
                    decision === "accepted" ? "Approved" : "Rejected",
                  updatedAt: new Date().toISOString(),
                },
              };
            }
            return item;
          }),
        }));

        toast.success(
          `Return request ${
            decision === "accepted" ? "approved" : "rejected"
          } successfully`
        );
        window.location.reload();
      } else {
        throw new Error(
          response.data.message || `Failed to ${decision} return request`
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdating(false);
      setReturnRequestConfirmationModal(false);
      setSelectedReturnRequest(null);
    }
  };
  const getReturnRequestStatusBadge = ( itemId, returnRequest) => {
    if (!returnRequest) return null;

    const statusColors = {
      Pending: "bg-orange-400 hover:bg-orange-500",
      Approved: "bg-green-400",
      Rejected: "bg-red-400",
    };

    return (
      <div
        className={`py-1 rounded-full ${
          statusColors[returnRequest.requestStatus]
        } ${
          returnRequest.requestStatus === "Pending"
            ? "hover:cursor-pointer"
            : ""
        }`}
        onClick={() =>
          returnRequest.requestStatus === "Pending" &&
          handleReturnRequestView(returnRequest, itemId)
          
        }
      >
        <p className="text-white text-center px-2">
          Return {returnRequest.requestStatus}
        </p>
      </div>
    );
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    if (newStatus === orderData.orderStatus) return;

    setPendingStatusChange(newStatus);
    setShowConfirmation(true);
  };

  const handleStatusChangeConfirmed = async () => {
    setShowConfirmation(false);
    setUpdating(true);

    try {
      const status = pendingStatusChange;
      console.log("orderid : " + orderId);
      console.log("status : " + status);
      const { data } = await orderService.updateOrderStatus(orderId, status);

      if (data.success) {
        if (data.order) {
          setOrderData(data.order);
        } else {
          setOrderData((prev) => ({
            ...prev,
            orderStatus: pendingStatusChange,
            orderItems: prev.orderItems.map((item) =>
              item.orderStatus !== "Cancelled"
                ? { ...item, orderStatus: pendingStatusChange }
                : item
            ),
          }));
        }
        toast.success(data.message || "Status updated successfully");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(
        // error.response?.data?.message ||
        //   error.message ||
        "Failed to update order status"
      );
    } finally {
      setUpdating(false);
      setPendingStatusChange(null);
    }
  };

  const payableAmount = () => {
    const subtotal = orderData.orderItems.reduce((total, item) => {
      if (item.orderStatus !== "Cancelled") {
        // Calculate item price after discount
        // const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
        // return total + (discountedPrice * item.quantity);
        return item.totalPrice;
      }
      return total;
    }, 0);
    return subtotal;
  };

  const handleStatusChangeDeclined = () => {
    setShowConfirmation(false);
    setPendingStatusChange(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Placed: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Order Not Found</h2>
        <p className="text-gray-600 mt-2">
          The requested order could not be found.
        </p>
      </div>
    );
  }

  const { shippingAddress, orderItems } = orderData;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <ConfirmationAlert
        show={showConfirmation}
        title="Confirm Status Change"
        message={getStatusConfirmationMessage(pendingStatusChange)}
        onCancel={handleStatusChangeDeclined}
        onProceed={handleStatusChangeConfirmed}
        noText="Cancel"
        yesText="Confirm"
      />

      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* Order Summary Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <span className="font-semibold">Order ID:</span>{" "}
              <span className="font-mono">{orderData.orderId}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Order Date:</span>{" "}
              {new Date(orderData.placedAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Payment Method:</span>{" "}
              {orderData.paymentMethod}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Payment Status:</span>{" "}
              {orderData.paymentStatus}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-semibold">Ordered Amount:</span>{" "}
              <span className="text-lg">
                ₹{orderData.orderedAmount?.toLocaleString()}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Payable Amount:</span>{" "}
              <span className="text-lg">
                ₹{orderData.payableAmount?.toLocaleString()}
              </span>
            </p>
            <div className="mb-2 flex gap-2">
              <span className="font-semibold block mb-1">Current Status:</span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                  orderData.orderStatus
                )}`}
              >
                {orderData.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Status Update Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Update Order Status</h3>
          <div className="max-w-xs">
            <select
              value={orderData.orderStatus}
              onChange={handleStatusChange}
              disabled={updating || orderData.orderStatus === "Cancelled"}
              className={`w-full p-2 border rounded ${
                updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${orderData.orderStatus === "Cancelled" ? "bg-gray-100" : ""}`}
            >
              {["Pending", "Placed", "Shipped", "Delivered", "Cancelled"].map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={
                      orderData.orderStatus === "Cancelled" ||
                      (orderData.orderStatus === "Delivered" &&
                        status !== "Delivered")
                    }
                  >
                    {status}
                  </option>
                )
              )}
            </select>
            {orderData.orderStatus === "Cancelled" && (
              <p className="text-sm text-red-600 mt-1">
                Cancelled orders cannot be updated
              </p>
            )}
            {orderData.orderStatus === "Delivered" && (
              <p className="text-sm text-green-600 mt-1">
                Delivered orders cannot be modified
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Customer Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
          Customer Details
        </h2>
        {shippingAddress && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">Name:</p>
                <p className="text-base font-semibold text-gray-800">
                  {shippingAddress.name}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">Email:</p>
                <p className="text-base font-semibold text-gray-800">
                  {shippingAddress.email}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">Phone:</p>
                <p className="text-base font-semibold text-gray-800">
                  {shippingAddress.phone}
                </p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">City:</p>
                <p className="text-base font-semibold text-gray-800">
                  {shippingAddress.city}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">State:</p>
                <p className="text-base font-semibold text-gray-800">
                  {shippingAddress.state}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">Pincode:</p>
                <p className="text-base font-semibold text-gray-800">
                  {shippingAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmationAlert
        show={showReturnRequestConfirmationModal}
        title={<div className="text-blue-600 text-center mb-3 text-2xl">Return Request Management</div>}
        message={
          selectedReturnRequest ? (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reason for Return</h3>
                <div className="text-gray-600">{selectedReturnRequest.reason}</div>
              </div>
              <div className="px-4 text-yellow-600">
                <div>Are you sure that you want to accept this return request?</div>
                <div className="text-[10px] text-gray-500">
                  (***Once accepted or rejected then the result will be irreversible)
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <div className="mt-2 text-gray-600">Loading return request details...</div>
            </div>
          )
        }
        onCancel={() => handleReturnRequestAction("rejected")}
        onProceed={() => handleReturnRequestAction("accepted")}
        noText="Reject "
        yesText="Accept "
      />

      {/* Order Items Card */}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Return Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orderData.orderItems?.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <span className="font-medium">{item.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    ₹{item.price?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ₹{item.totalPrice?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm text-center w-full ${getStatusColor(
                        item.orderStatus
                      )}`}
                    >
                      {item.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.returnRequest &&
                      getReturnRequestStatusBadge(item._id, item.returnRequest)}{/**######################################################## */}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right font-semibold">
                  Total Amount:
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{orderData.orderedAmount?.toLocaleString()}
                </td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right font-semibold">
                  Payable Amount:
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{orderData.payableAmount?.toLocaleString()}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
