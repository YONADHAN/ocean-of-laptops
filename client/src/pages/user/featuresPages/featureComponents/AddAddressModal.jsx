import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance } from "../../../../api/axiosConfig";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AddAddressModal = ({ isOpen, onClose, onAddressAdded, redirectToCheckout = false }) => {
  const navigate = useNavigate();

  const handleAddAddress = async (newAddress) => {
    try {
      const token = Cookies.get('access_token');
      const decode = jwtDecode(token);
      const userId = decode._id;

      const response = await axiosInstance.post('/address_add', { newAddress, userId });

      if (response?.status === 200) {
        toast.success('Address added successfully');
        console.log('Address added successfully');
        onClose(); // Close the modal
        onAddressAdded(); // Notify parent component
        if (redirectToCheckout) {
          navigate('/user/features/cart/checkout');
        }
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Address</h2>
        <AddressForm onSubmit={handleAddAddress} />
      </div>
    </div>
  );
};

const AddressForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    flatHouseNo: "",
    areaStreet: "",
    landmark: "",
    city: "",
    state: "",
    addressType: "Home",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="pincode"
        value={formData.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="flatHouseNo"
        value={formData.flatHouseNo}
        onChange={handleChange}
        placeholder="Flat, House no., Building, Company, Apartment"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="areaStreet"
        value={formData.areaStreet}
        onChange={handleChange}
        placeholder="Area, Street, Sector, Village"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="landmark"
        value={formData.landmark}
        onChange={handleChange}
        placeholder="Landmark"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="Town/City"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="State"
        required
        className="w-full p-2 border rounded"
      />
      <select
        name="addressType"
        value={formData.addressType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Home">Home</option>
        <option value="Work">Work</option>
        <option value="Other">Other</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Address
      </button>
    </form>
  );
};

export default AddAddressModal;

