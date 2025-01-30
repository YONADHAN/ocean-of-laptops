

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosConfig";
import {orderService} from "../../../apiServices/userApiServices"
import Table from "../../../components/MainComponents/Table";
import Pagination from "../../../components/MainComponents/Pagination";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(4);
  const navigate = useNavigate();

  const fetchOrders = async (page) => {
    try {
      // const response = await axiosInstance.get(
      //   `/order_history?page=${page}&limit=${itemsPerPage}`
      // );
      const response = await orderService.getOrderHistory(page, itemsPerPage)
      setOrders(response.data.orders);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, itemsPerPage]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-500";
      case "in progress":
        return "text-orange-500";
      case "canceled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const columns = [
    { label: "PRODUCT NAME", key: "productName" },
    { label: "STATUS", key: "status" },
    { label: "DATE", key: "date" },
    { label: "TOTAL", key: "total" },
    { label: "ACTION", key: "action" },
  ];

  const renderHeader = (columns) => {
    return (
      <>
        {columns.map((column, index) => (
          <div key={index} className="hidden md:block p-2 text-left font-medium">
            {column.label}
          </div>
        ))}
      </>
    );
  };

  const renderRow = (order) => {
    const renderContent = (key) => {
      switch (key) {
        case "productName":
          return (
            <div className="space-y-1">
              {order.orderItems.map((item, idx) => (
                <div key={`item-${idx}`} className="text-sm text-gray-900">
                  {idx + 1}. {item.productName} ({item.quantity})
                </div>
              ))}
            </div>
          );
        case "status":
          return (
            <div className="space-y-1">
              {order.orderItems.map((item, idx) => (
                <div key={`status-${idx}`} className={`text-sm ${getStatusColor(item.orderStatus)}`}>
                  {item.orderStatus}
                </div>
              ))}
            </div>
          );
        case "date":
          return (
            <div className="text-sm text-gray-900">
              {new Date(order.placedAt?.$date || order.placedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          );
        case "total":
          return (
            <div className="text-sm text-gray-900">
              {/* ₹{order.totalAmount.toLocaleString()} ({order.orderItems.length} Items) */}
              ₹{order.orderedAmount.toLocaleString()} 
            </div>
          );
        case "action":
          return (
            <button
              onClick={() => navigate(`/user/features/order/trackMyOrderAndCancel/${order._id}`)}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              View Order
            </button>
          );
        default:
          return null;
      }
    };

    return (
      <>
        {/* Mobile view */}
        <div className="md:hidden col-span-5 space-y-4 p-4 border-b">
          {columns.map((column) => (
            <div key={column.key} className="flex justify-between items-start">
              <span className="font-medium text-gray-700">{column.label}:</span>
              <div className="text-right">{renderContent(column.key)}</div>
            </div>
          ))}
        </div>

        {/* Desktop view */}
        {columns.map((column) => (
          <div key={column.key} className="hidden md:block p-4">
            {renderContent(column.key)}
          </div>
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold text-gray-700">No Orders Found</h2>
        <button
          onClick={() => navigate("/user/shop")}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>
      <Table
        columns={columns}
        rows={orders}
        renderHeader={renderHeader}
        renderRow={renderRow}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default OrderHistory;
