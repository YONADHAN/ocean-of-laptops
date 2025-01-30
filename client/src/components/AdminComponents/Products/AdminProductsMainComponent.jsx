import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { axiosInstance } from "../../../api/axiosConfig";
import { productService } from "../../../apiServices/adminApiServices";
import ConfirmationAlert from "../../MainComponents/ConformationAlert";
import Table from "../../MainComponents/Table";
import Pagination from "../../MainComponents/Pagination";
import { toast } from "sonner";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPercentage, setOfferPercentage] = useState("");
  const [selectedProductForOffer, setSelectedProductForOffer] = useState(null);
  const [showOfferConfirmation, setShowOfferConfirmation] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 3,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProducts(1, pagination.limit);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (pagination.currentPage > 1) {
      fetchProducts(pagination.currentPage, pagination.limit);
    }
  }, [pagination.currentPage]);

  const fetchProducts = async (page, limit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts({
        page,
        limit,
        search: debouncedSearchTerm,
      });
      const data = response.data;
      setProducts(data.products);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBlock = (product) => {
    setSelectedProduct(product);
    setShowAlert(true);
  };

  const handleProceed = async () => {
    if (!selectedProduct) return;
    try {
      const response = await productService.toggleBlockProduct(
        selectedProduct._id
      );
      if (response.data.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProduct._id
              ? { ...product, isBlocked: response.data.isBlocked }
              : product
          )
        );
        toast.success(
          `Product ${
            response.data.isBlocked ? "blocked" : "unblocked"
          } successfully`
        );
      }
    } catch (error) {
      console.error("Error toggling product block status:", error);
      toast.error("Failed to update product status");
    } finally {
      setShowAlert(false);
      setSelectedProduct(null);
    }
  };

  const handleCancel = () => {
    setShowAlert(false);
    setSelectedProduct(null);
  };

  const handleEdit = (productId) => {
    navigate(`/admin/product_edit/${productId}`);
  };

  const handleOfferClick = (product) => {
    setSelectedProductForOffer(product);
    setOfferPercentage(product.offer.toString());
    setShowOfferModal(true);
  };

  const handleOfferInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setOfferPercentage(value);
    }
  };

  const handleOfferSubmit = () => {
    if (offerPercentage === "" || isNaN(offerPercentage)) {
      toast.error("Please enter a valid offer percentage");
      return;
    }
    setShowOfferModal(false);
    setShowOfferConfirmation(true);
  };

  const confirmOfferSubmit = async () => {
    try {
      const productId = selectedProductForOffer._id;
      const offer = parseFloat(offerPercentage);
      if (offer < 0 || offer > 100) {
        toast.error("Offer percentage should be between 0 and 100");
        return;
      }
    

      const response = await productService.updateProductOffer(
        productId,
        offer
      );
   

      if (response.status === 200) {
        const updatedProducts = products.map((product) =>
          product._id === productId ? { ...product, offer } : product
        );
        setProducts(updatedProducts);

        if (offer === 0) {
          toast.success(
            `Offer removed from ${selectedProductForOffer.productName}`
          );
        } else {
          toast.success(
            `${offer}% offer applied to ${selectedProductForOffer.productName}`
          );
        }
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Failed to update offer. Please try again.");
    } finally {
      setShowOfferModal(false);
      setShowOfferConfirmation(false);
      setSelectedProductForOffer(null);
      setOfferPercentage("");
    }
  };

  const cancelOfferSubmit = () => {
    setShowOfferConfirmation(false);
  };

  const goToCategory = () => {
    navigate(`/admin/category`);
  };

  const columns = [
    { label: "Product", key: "product" },
    { label: "Category", key: "category" },
    { label: "Price", key: "price" },
    { label: "Stock", key: "stock" },
    { label: "Status", key: "status" },
    { label: "Offer", key: "offer" },
    { label: "Actions", key: "actions" },
  ];

  const renderHeader = (columns) => (
    <>
      {columns.map((column, index) => (
        <div
          key={index}
          className="hidden md:block p-3 ml-9 text-left font-medium"
        >
          {column.label}
        </div>
      ))}
    </>
  );

  const renderRow = (product) => {
    const renderContent = (key) => {
      switch (key) {
        case "product":
          return (
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full mr-2"
                src={product.productImage[0] || "/placeholder.svg"}
                alt={product.productName}
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {product.productName}
                </div>
                <div className="text-sm text-gray-500">{product.brand}</div>
              </div>
            </div>
          );
        case "category":
          return (
            <div className="text-sm text-gray-900">{product.category.name}</div>
          );
        case "price":
          return (
            <div>
              <div className="text-sm text-gray-900">
                ₹{product.regularPrice} (regular)
              </div>
              <div className="text-sm text-gray-600">
                ₹{product.salePrice} (sales)
              </div>
            </div>
          );
        case "stock":
          return (
            <div className="text-sm text-center">
              {product.quantity === 0 ? (
                <span className="text-red-500">Out of Stock</span>
              ) : (
                product.quantity
              )}
            </div>
          );
        case "status":
          return (
            <span
              className={`px-5 py-1 rounded-full text-xs font-medium ${
                product.isBlocked
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {product.isBlocked ? "Blocked" : "Active"}
            </span>
          );
        case "offer":
          return (
            <div className="w-44 h-16 flex">
            <div 
              className="bg-green-200 text-green-800 flex items-center justify-center px-3 w-16 flex-col"
              title="Click to change product offer"
            >
              {Math.max(product.offer, product.category.offer)}%
              <p className="text-[10px]">Applied</p>
            </div>
            
            <div className="flex flex-col flex-grow">
              <button
                onClick={() => handleOfferClick(product)}
                className={`py-1 text-xs font-medium h-8 w-full ${
                  product.offer === 0
                    ? "bg-red-800 text-white hover:bg-red-700"
                    : "bg-green-800 text-white hover:bg-green-700"
                }`}
                title="Click to change product offer"
              >
                {product.offer === 0
                  ? "Add Offer"
                  : `${product.offer}% Pro off`}
              </button>
              
              <p
                className="text-xs bg-gray-400 text-white px-2 py-1 h-8 w-full text-center cursor-pointer"
                onDoubleClick={goToCategory}
                title="Double click to navigate to category page"
              >
                {product.category.offer}% Cat off
              </p>
            </div>
          </div>
          
          );
        case "actions":
          return (
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => handleEdit(product._id)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleBlock(product)}
                className={`${
                  product.isBlocked ? "text-green-600" : "text-red-600"
                } hover:underline`}
              >
                {product.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <div className="md:hidden col-span-6 space-y-4 p-4 border-b">
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

  if (loading && !searchTerm) {
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
            fetchProducts(pagination.currentPage, pagination.limit)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-800">Products</h2>
        <Link
          to="/admin/product_add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        {loading && searchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table
              columns={columns}
              rows={products}
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

      {/* Block/Unblock Confirmation Modal */}
      <ConfirmationAlert
        show={showAlert}
        title={`${selectedProduct?.isBlocked ? "Unblock" : "Block"} Product`}
        message={`Are you sure you want to ${
          selectedProduct?.isBlocked ? "unblock" : "block"
        } ${selectedProduct?.productName}?`}
        onCancel={handleCancel}
        onProceed={handleProceed}
        noText="No, Cancel"
        yesText="Yes, Confirm"
      />

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {offerPercentage === "0" ? "Add Offer" : "Update Offer"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Percentage
              </label>
              <input
                type="number"
                value={offerPercentage}
                onChange={handleOfferInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter offer percentage"
                min="0"
                max="100"
              />
            </div>
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
                Apply Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Confirmation Modal */}
      {showOfferConfirmation && (
        <ConfirmationAlert
          show={showOfferConfirmation}
          title="Confirm Offer Application"
          message={`Are you sure you want to apply ${offerPercentage}% offer to ${selectedProductForOffer?.productName}?`}
          onCancel={cancelOfferSubmit}
          onProceed={confirmOfferSubmit}
          noText="No, Cancel"
          yesText="Yes, Apply"
        />
      )}
    </div>
  );
};

export default ProductList;
