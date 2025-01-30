
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../../../api/axiosConfig";
import {customerService } from "../../../apiServices/adminApiServices"
import { User } from "lucide-react";
import Table from "../../MainComponents/Table";
import Pagination from "../../MainComponents/Pagination";
import ConfirmationAlert from "../../MainComponents/ConformationAlert";
import debounce from "lodash/debounce";

function UserTable({ users, columns, onAction, loading }) {
  const renderHeader = (columns) => (
    <>
      {columns.map((column, index) => (
        <div key={index} className="hidden md:block p-2 text-left font-medium">
          {column.label}
        </div>
      ))}
    </>
  );

  const renderRow = (user) => {
    const renderContent = (key) => {
      switch (key) {
        case "username":
          return (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="flex justify-center py-1 text-gray-400">
                    <User />
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-900">{user.username}</span>
            </div>
          );
        case "email":
          return <div className="text-sm text-gray-600">{user.email}</div>;
        case "status":
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
              {user.isBlocked ? "Blocked" : "Active"}
            </span>
          );
        case "actions":
          return (
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => onAction(user, user.isBlocked ? "unblock" : "block")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  user.isBlocked
                    ? "border border-gray-300 hover:bg-gray-100"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}>
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <div className="md:hidden col-span-4 space-y-4 p-4 border-b">
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
      rows={users}
      renderHeader={renderHeader}
      renderRow={renderRow}
    />
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCustomers: 0,
    totalPages: 0,
    limit: 3,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");

  const columns = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" },
  ];

  const fetchUsers = async (page = 1, limit = 5, query = "") => {
    try {
      setTableLoading(true);
      const response = await axiosInstance.get(`/admin/get_customers`, {
        params: { page, limit, searchQuery: query },
      });

      setUsers(response.data.customers);
      setPagination({
        totalCustomers: response.data.totalCustomers,
        totalPages: response.data.totalPages,
        limit,
      });
    } catch (err) {
      toast.error("Error fetching users", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setTableLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((query) => {
      setCurrentPage(1);
      fetchUsers(1, pagination.limit, query);
    }, 700),
    []
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetch(query);
  };

  const handleBlockUnblock = async (action) => {
    if (!selectedUser) return;

    try {
    

      if (action === "block") {
        await customerService.blockCustomer(selectedUser._id);
        toast.success(`Customer blocked successfully.`);
      } else if (action === "unblock") {
        await customerService.unblockCustomer(selectedUser._id);
        toast.success(`Customer unblocked successfully.`);
      } 
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === selectedUser._id
            ? { ...user, isBlocked: action === "block" }
            : user
        )
      );
      toast.success(`User ${action}ed successfully`);
    } catch (err) {
      toast.error(`${action} user failed`, {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setShowAlert(false);
      setSelectedUser(null);
    }
  };

  const confirmAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowAlert(true);
  };

  useEffect(() => {
    fetchUsers(currentPage, pagination.limit, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-800">User Management</h2>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <UserTable 
              users={users}
              columns={columns}
              onAction={confirmAction}
              loading={tableLoading}
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

      <ConfirmationAlert
        show={showAlert}
        title={`${actionType} User`}
        message={`Are you sure you want to ${actionType} ${selectedUser?.username}?`}
        onCancel={() => setShowAlert(false)}
        onProceed={() => handleBlockUnblock(actionType)}
        noText="Cancel"
        yesText="Confirm"
      />
    </div>
  );
}

export default UserManagement;
