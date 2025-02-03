





import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search } from 'lucide-react';
import Table from "../../MainComponents/Table";
import Pagination from "../../MainComponents/Pagination";
import { axiosInstance } from "../../../api/axiosConfig";
import {orderService} from '../../../apiServices/adminApiServices'
import debounce from "lodash/debounce";

function OrderTable({ orders, columns, onViewDetails, loading }) {
  const renderHeader = (columns) => (
    <>
      {columns.map((column, index) => (
        <div key={index} className="hidden md:block p-2 text-left font-medium">
          {column.label}
        </div>
      ))}
    </>
  );

  const renderRow = (order) => {
    const getStatusClass = (status) => {
      switch (status) {
        case "Delivered":
          return "bg-green-100 text-green-700";
        case "Pending":
          return "bg-yellow-100 text-yellow-700";
        case "Cancelled":
          return "bg-red-100 text-red-700";    
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    const renderContent = (key) => {
      switch (key) {
        case "orderId":
          return <span className="text-sm text-gray-900">{order.orderId}</span>;
        case "customer":
          return <span className="text-sm text-gray-600">{order.user?.username || "N/A"}</span>;
        case "orderedDate":
          return <span className="text-sm text-gray-600">{new Date(order.placedAt).toLocaleDateString()}</span>;
        case "expDelivery":
          return <span className="text-sm text-gray-600">
            {new Date(new Date(order.placedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>;
        case "status":
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          );
        case "total":
          return <span className="text-sm text-gray-900">₹{order.orderedAmount}</span>;
        case "actions":
          return (
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => onViewDetails(order.orderId)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                View Details
              </button>
            </div>
          );
        case "isReturnReq":
          return(
            <div className="flex justify-center ">              
             {order.isReturnReq === true ?  <label className="ml-2 bg-red-400 px-3 rounded-lg py-2 text-white text-nowrap">Requested</label>: <label className="ml-2 text-gray-700">Not Requested</label>}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <div className="md:hidden col-span-7 space-y-4 p-4 border-b">
          {columns.map((column) => (
            <div key={column.key} className="flex justify-between items-start">
              <span className="font-medium text-gray-700">{column.label}:</span>
              <div className="text-right">{renderContent(column.key)}</div>
            </div>
          ))}
        </div>
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
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      rows={orders}
      renderHeader={renderHeader}
      renderRow={renderRow}
    />
  );
}

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 0,
    limit: 4,
  });

  const navigate = useNavigate();

  const columns = [
    { label: "Order ID", key: "orderId" },
    { label: "Customer", key: "customer" },
    { label: "Ordered Date", key: "orderedDate" },
    { label: "Exp Delivery", key: "expDelivery" },
    { label: "Status", key: "status" },
    { label: "Total", key: "total" },
    { label: "Return Request", key: 'isReturnReq'},
    { label: "Actions", key: "actions" },
  ];

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const fetchOrders = async ({ page = 1, query = "" }) => {
    try {
      setLoading(true);
    
      const {data} =  await orderService.getOrders({page, limit: pagination.limit, searchQuery: query})

      if (data.success) {
        setOrders(data.orders);
        setPagination({
          totalOrders: data.pagination.totalOrders,
          totalPages: data.pagination.totalPages,
          limit: data.pagination.limit,
        });
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      toast.error("Error fetching orders", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchOrders = useCallback(
    debounce((query) => {
      setCurrentPage(1);
      fetchOrders({ page: 1, query });
    }, 700),
    []
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchOrders(query);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/order_details/${orderId}`);
  };

  useEffect(() => {
    fetchOrders({ page: currentPage, query: searchQuery });
  }, [currentPage]);

  useEffect(() => {
    return () => {
      debouncedFetchOrders.cancel();
    };
  }, [debouncedFetchOrders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-800">Order Management</h2>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <OrderTable 
              orders={orders}
              columns={columns}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default OrderManagement;
