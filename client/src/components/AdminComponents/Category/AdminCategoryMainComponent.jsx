

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { axiosInstance } from "../../../api/axiosConfig";
import { categoryService } from "../../../apiServices/adminApiServices";
import ConfirmationAlert from "../../MainComponents/ConformationAlert";
import Table from "../../../components/MainComponents/Table";
import Pagination from "../../../components/MainComponents/Pagination";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPercentage, setOfferPercentage] = useState("");
  const [showOfferConfirmation, setShowOfferConfirmation] = useState(false);
  const [selectedCategoryForOffer, setSelectedCategoryForOffer] =
    useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 3,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage]);

  const fetchCategories = async (page, limit) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      const response = await categoryService.getCategories(params);
      const data = response.data;
      setCategories(data.categories);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again later.");
    }
    setLoading(false);
  };

  const handleBlock = async (categoryId, state) => {
    try {
      const endpoint = `/admin/category_${
        state ? "unblock" : "block"
      }/${categoryId}`;
      await axiosInstance.patch(endpoint);
      const updatedCategories = categories.map((category) =>
        category._id === categoryId
          ? { ...category, isBlocked: !state }
          : category
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error updating category status:", error);
      setError("Failed to update category status. Please try again.");
    }
  };

  const handleEdit = (categoryId) => {
    navigate(`/admin/category_edit/${categoryId}`);
  };

  const confirmBlockToggle = (category) => {
    setSelectedCategory(category);
    setShowAlert(true);
  };

  const proceedBlockToggle = () => {
    if (selectedCategory) {
      handleBlock(selectedCategory._id, selectedCategory.isBlocked);
    }
    setShowAlert(false);
    setSelectedCategory(null);
  };

  const cancelBlockToggle = () => {
    setShowAlert(false);
    setSelectedCategory(null);
  };
  const handleOfferSubmit = () => {
    setShowOfferModal(false)
    setShowOfferConfirmation(true);
  };

  const handleOfferClick = (category) => {
    setSelectedCategoryForOffer(category);
    setOfferPercentage(category.offer || "");
    setShowOfferModal(true);
  };

  const confirmOfferSubmit = async () => {
    try {
      const categoryId = selectedCategoryForOffer._id;
      const offer = parseFloat(offerPercentage);
      const offerApplied = await axiosInstance.post('/admin/update_category_offer', {
        offer,
        categoryId,
      });
  
      if (offerApplied.status === 200) {
        if (offer === 0) {
          toast.success(`No offer was applied for ${selectedCategoryForOffer.name}`);
        } else {
          toast.success(`${offer}% offer was successfully applied for ${selectedCategoryForOffer.name}`);
        }
      }
  
      const updatedCategories = categories.map((category) =>
        category._id === selectedCategoryForOffer._id
          ? { ...category, offer: parseFloat(offerPercentage) }
          : category
      );
  
      setCategories(updatedCategories);
      //setShowOfferModal(false);
      setShowOfferConfirmation(false);
      setSelectedCategoryForOffer(null);
      setOfferPercentage("");
    } catch (error) {
      console.error("Error updating offer:", error);
      setError("Failed to update offer. Please try again.");
    }
  };
  
  const cancelOfferSubmit = () => {
    setShowOfferConfirmation(false);
  };

  const columns = [
    { label: "Category Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Status", key: "status" },
    { label: "Offer", key: "offer" },
    { label: "Actions", key: "actions" },
  ];

  const renderHeader = (columns) => (
    <>
      {columns.map((column, index) => (
        <div key={index} className="hidden md:block p-2 text-left font-medium">
          {column.label}
        </div>
      ))}
    </>
  );

  const renderRow = (category) => {
    const renderContent = (key) => {
      switch (key) {
        case "name":
          return <div className="text-sm text-gray-900">{category.name}</div>;
        case "description":
          return (
            <div className="text-sm text-gray-600">{category.description}</div>
          );
        case "status":
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                category.isBlocked
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {category.isBlocked ? "Blocked" : "Active"}
            </span>
          );
        case "offer":
          return (
            <button
              onClick={() => handleOfferClick(category)}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                category.offer ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {category.offer ? `${category.offer}% Off` : "Add offer"}
            </button>
          );
        case "actions":
          return (
            <div className="flex justify-center space-x-3 ">
              <button
                onClick={() => handleEdit(category._id)}
                className="text-blue-600 hover:text-blue-800 w-44"
              >
                Edit
              </button>
              <button
                onClick={() => confirmBlockToggle(category)}
                className="text-red-600 hover:text-red-800"
              >
                {category.isBlocked ? (
                  <div className="text-green-500 lg:w-36 lg:mr-40">UnBlock</div>
                ) : (
                  <div className="text-red-500 lg:w-36 lg:mr-40">Block</div>
                )}
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
        <button
          onClick={() =>
            fetchCategories(pagination.currentPage, pagination.limit)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-800">Categories</h2>
        <button
          onClick={() => navigate("/admin/category_add")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Create Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table
              columns={columns}
              rows={categories}
              renderHeader={renderHeader}
              renderRow={renderRow}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, currentPage: page }))
          }
        />
      </div>
      <ConfirmationAlert
        show={showAlert}
        title="Confirm Action"
        message={`Are you sure you want to ${
          selectedCategory?.isBlocked ? "unblock" : "block"
        } this category?`}
        onCancel={cancelBlockToggle}
        onProceed={proceedBlockToggle}
        noText="Cancel"
        yesText="Confirm"
      />

      <ConfirmationAlert
        show={showOfferConfirmation}
        title="Confirm Offer Application"
        message={`Are you sure you want to apply a ${offerPercentage}% offer to ${selectedCategoryForOffer?.name}?`}
        onCancel={cancelOfferSubmit}
        onProceed={confirmOfferSubmit}
        noText="Cancel"
        yesText="Confirm"
      />

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Set Offer Percentage</h3>
            <input
              type="number"
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Enter offer percentage"
              min="0"
              max="100"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleOfferSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
