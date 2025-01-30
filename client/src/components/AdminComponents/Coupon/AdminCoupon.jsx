import React, { useEffect, useState } from "react";
import Table from "../../../components/MainComponents/Table";
import ConfirmationAlert from "../../../components/MainComponents/ConformationAlert";
import Pagination from "../../../components/MainComponents/Pagination";
import { axiosInstance } from "../../../api/axiosConfig";
import CouponModal from "../../AdminComponents/Coupon/AdminCouponCreationForm";
import { toast } from "sonner";

const AdminCouponTable = () => {
  const [coupons, setCoupons] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showCouponCreateAlert, setShowCouponCreateAlert] = useState(false);
  const [showCouponEditAlert, setShowCouponEditAlert] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 4;

  useEffect(() => {
    fetchCoupons(currentPage);
  }, [currentPage]);

  const fetchCoupons = async (page) => {
    try {
      const response = await axiosInstance.post(
        "/admin/get_coupons_for_admin",
        { page, limit }
      );
      setCoupons(response.data.coupons);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Error fetching coupons");
    }
  };

  const validate = (data) => {
    if (!data.couponCode || data.couponCode.trim() === "") {
      toast.error("Coupon code is required");
      return false;
    }
    if (!data.description || data.description.trim() === "") {
      toast.error("Description is required");
      return false;
    }
    if (
      !data.discountPercentage ||
      data.discountPercentage <= 0 ||
      data.discountPercentage > 100
    ) {
      toast.error("Discount percentage must be between 1 and 100");
      return false;
    }
    if (!data.startDate || !data.endDate) {
      toast.error("Start date and end date are required");
      return false;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start < now) {
      toast.error("Start date cannot be in the past");
      return false;
    }
    if (end <= start) {
      toast.error("End date must be after start date");
      return false;
    }
    if (!data.minPurchaseAmount || data.minPurchaseAmount < 0) {
      toast.error("Minimum purchase amount must be 0 or greater");
      return false;
    }
    if (!data.maxDiscountPrice || data.maxDiscountPrice < 0) {
      toast.error("Maximum discount price must be 0 or greater");
      return false;
    }
    return true;
  };

  const handleSubmit = async (data) => {
    if (!data) return;
    const isValid = validate(data);
    if (!isValid) return;
    setFormData(data);
    setShowCouponCreateAlert(true);
  };

  const handleEditSubmit = async (data) => {
    if (!data) return;
    const isValid = validate(data);
    if (!isValid) return;
    setFormData(data);
    setShowCouponEditAlert(true);
  };
  const handleEditConfirmSubmit = async () => {
    if (!formData) return;
    try {
      await axiosInstance.post("/admin/update_coupon", { formData });
      toast.success("Coupon updated successfully");
      fetchCoupons(currentPage);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating coupon");
    } finally {
      setShowCouponEditAlert(false);
      setShowModal(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!formData) return;
    try {
      const response = await axiosInstance.post("/admin/create_coupon", {
        formData,
      });
      if (response.status === 200) {
        toast.success("Coupon created successfully");
        fetchCoupons(currentPage);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating coupon");
    } finally {
      setShowCouponCreateAlert(false);
      setShowModal(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;
    try {
      await axiosInstance.post("/admin/delete_coupon", {
        couponCode: selectedCoupon.couponCode,
      });
      toast.success("Coupon deleted successfully");
      fetchCoupons(currentPage);
      setShowAlert(false);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Error deleting coupon");
    }
  };

  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      ...coupon,
      startDate: formatDateToInputValue(coupon.startDate),
      endDate: formatDateToInputValue(coupon.endDate),
    });
    setShowModal(true);
  };

  const formatDateToInputValue = (date) => {
    const localDate = new Date(date);
    return localDate.toISOString().split("T")[0];
  };

  const columns = [
    { label: "Coupon Code", key: "couponCode" },
    { label: "Discount (%)", key: "discountPercentage" },
    { label: "Start Date", key: "startDate" },
    { label: "End Date", key: "endDate" },
    { label: "Min Purchase", key: "minPurchaseAmount" },
    { label: "Max Discount", key: "maxDiscountPrice" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" },
  ];

  return (
    <div className="mt-4">
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-bold mb-4">Admin Coupon Table</h2>
        <button
          className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          onClick={() => {
            setSelectedCoupon(null);
            setFormData(null);
            setShowModal(true);
          }}
        >
          Create Coupon
        </button>
      </div>

      <CouponModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleSubmit}
        onEdit={handleEditSubmit}
        initialData={formData}
        isEditing={!!selectedCoupon}
      />

      <Table
        columns={columns}
        rows={coupons}
        renderRow={(coupon) => (
          <>
            <div className="p-2">{coupon.couponCode}</div>
            <div className="p-2">{coupon.discountPercentage}%</div>
            <div className="p-2">
              {new Date(coupon.startDate).toLocaleDateString()}
            </div>
            <div className="p-2">
              {new Date(coupon.endDate).toLocaleDateString()}
            </div>
            <div className="p-2">{coupon.minPurchaseAmount}</div>
            <div className="p-2">{coupon.maxDiscountPrice}</div>
            <div className="p-2">{coupon.status}</div>
            <div className="p-2 flex gap-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleEditCoupon(coupon)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  setSelectedCoupon(coupon);
                  setShowAlert(true);
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmationAlert
        show={showAlert}
        title="Confirm Deletion"
        message={`Are you sure you want to delete coupon "${selectedCoupon?.couponCode}"?`}
        onCancel={() => setShowAlert(false)}
        onProceed={handleDelete}
        noText="Cancel"
        yesText="Delete"
      />

      <ConfirmationAlert
        show={showCouponCreateAlert}
        title="Confirm Coupon Creation"
        message="Are you sure you want to create this coupon?"
        onCancel={() => setShowCouponCreateAlert(false)}
        onProceed={handleConfirmSubmit}
        noText="Cancel"
        yesText="Create"
      />

      <ConfirmationAlert
        show={showCouponEditAlert}
        title="Confirm Coupon Edit"
        message="Are you sure you want to save the edited changes of this coupon?"
        onCancel={() => setShowCouponEditAlert(false)}
        onProceed={handleEditConfirmSubmit}
        noText="Cancel"
        yesText="Update"
      />
    </div>
  );
};

export default AdminCouponTable;
