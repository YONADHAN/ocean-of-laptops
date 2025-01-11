

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../api/axiosConfig";
import {authService } from "../../../../apiServices/userApiServices";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { jwtDecode as jwt_decode } from "jwt-decode";
import ConfirmationAlert from "../../../../components/MainComponents/ConformationAlert";

function AddressCard({ address, onRemove, onSetDefault, onEdit }) {
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [showDefaultAlert, setShowDefaultAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);

  const handleSetDefault = async () => {
    if (address.isDefault || isSettingDefault) return;
    setShowDefaultAlert(true);
  };

  const handleRemoveClick = () => {
    if (address.isDefault) return;
    setShowRemoveAlert(true);
  };

  const handleEditClick = () => {
    setShowEditAlert(true);
  };

  const proceedWithDefault = async () => {
    setIsSettingDefault(true);
    try {
      await onSetDefault();
    } catch (error) {
      toast.error("Failed to set default address");
    } finally {
      setIsSettingDefault(false);
      setShowDefaultAlert(false);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 relative ${
        address.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <div className="mb-4">
        {address.isDefault && (
          <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
            Default Address
          </span>
        )}
      </div>
      
      <h2 className="text-lg font-bold">{address.name}</h2>
      <p className="text-gray-600">{address.addressType}</p>
      
      <div className="mt-2 space-y-1">
        <p>{address.flatHouseNo}</p>
        <p>{address.areaStreet}</p>
        {address.landmark && <p>Landmark: {address.landmark}</p>}
        <p>{address.state} - {address.pincode}</p>
        <p>{address.country}</p>
        <p className="mt-2">📱 {address.phone}</p>
      </div>

      {address.deliveryInstructions && (
        <div className="mt-3 text-sm text-gray-600">
          <p>Instructions: {address.deliveryInstructions}</p>
        </div>
      )}

      <div className="flex mt-4 space-x-2 ">
        <button
          onClick={handleEditClick}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={handleSetDefault}
          disabled={address.isDefault || isSettingDefault}
          className={`${
            address.isDefault 
              ? "bg-green-500"
              : isSettingDefault
              ? "bg-gray-400"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white px-3 py-1 rounded`}
        >
          {address.isDefault ? "Default" : isSettingDefault ? "Setting..." : "Set Default"}
        </button>
        <button
          onClick={handleRemoveClick}
          disabled={address.isDefault}
          className={`${
            address.isDefault ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          } text-white px-3 py-1 rounded`}
        >
          Remove
        </button>
      </div>

      <ConfirmationAlert
        show={showRemoveAlert}
        title="Remove Address"
        message="Are you sure you want to remove this address?"
        onCancel={() => setShowRemoveAlert(false)}
        onProceed={() => {
          onRemove();
          setShowRemoveAlert(false);
        }}
        noText="Cancel"
        yesText="Remove"
      />

      <ConfirmationAlert
        show={showDefaultAlert}
        title="Set as Default"
        message="Do you want to set this as your default address?"
        onCancel={() => setShowDefaultAlert(false)}
        onProceed={proceedWithDefault}
        noText="Cancel"
        yesText="Set Default"
      />

      <ConfirmationAlert
        show={showEditAlert}
        title="Edit Address"
        message="Do you want to edit this address?"
        onCancel={() => setShowEditAlert(false)}
        onProceed={() => {
          onEdit();
          setShowEditAlert(false);
        }}
        noText="Cancel"
        yesText="Edit"
      />
    </div>
  );
}

export default function AddressManagement() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAddresses = async (userId) => {    
    try {
      setIsLoading(true);
      setError(null);
      //const response = await axiosInstance.get(`/addresses_get?userId=${userId}`);
      const response = await authService.getAddresses(userId);
      setAddresses(response.data.addresses);
      const defaultAddress = response.data.addresses.find((addr) => addr.isDefault);
      if (defaultAddress) setDefaultAddressId(defaultAddress.id);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching addresses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Token not found");
      return;
    }
    try {
      const { _id: userId } = jwt_decode(token);
      fetchAddresses(userId);
    } catch (err) {
      console.error("Error decoding token:", err);
      toast.error("Invalid token");
    }
  }, []);

  const removeAddress = async (id) => {
    try {
      const response = await axiosInstance.delete(`/addresses_remove/${id}`);
      if (response.status === 200) {
        toast.success("Address removed successfully");
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address._id !== id)
        );
      }
    } catch (err) {
      console.error("Error removing address:", err);
      toast.error("Failed to remove address");
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      // const response = await axiosInstance.put(`/addresses/${id}/default`);
      const response = await authService.setDefaultAddress(id);
      if (response.status === 200) {
        toast.success("Default address updated successfully");
        setDefaultAddressId(id);
        
        const token = Cookies.get("access_token");
        const { _id: userId } = jwt_decode(token);
        await fetchAddresses(userId);
      }
      toast.success("Default address updated successfully");
      setDefaultAddressId(id);
      
      const token = Cookies.get("access_token");
      const { _id: userId } = jwt_decode(token);
      await fetchAddresses(userId);
    } catch (err) {
      console.error("Error setting default address:", err);
      toast.error("Failed to set default address");
    }
  };

  const navigateToAddAddress = () => navigate("/user/features/account/addresses/add");

  const navigateToEditAddress = (address) =>
    navigate(`/user/features/account/addresses/edit/${address._id}`, {
      state: { address },
    });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-600">Loading addresses...</div>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  //         <p>Error loading addresses: {error}</p>
  //         <button
  //           onClick={() => {
  //             const token = Cookies.get("access_token");
  //             const { _id: userId } = jwt_decode(token);
  //             fetchAddresses(userId);
  //           }}
  //           className="mt-2 text-sm text-red-600 hover:underline"
  //         >
  //           Try again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Addresses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={navigateToAddAddress}
          aria-label="Add a new address"
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors flex flex-col items-center justify-center min-h-[200px]"
        >
          <div className="w-12 h-12 mb-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xl text-gray-600">Add address</span>
        </button>
        {addresses.length === 0 ? (
          <div className="text-gray-600 text-center col-span-full">
            No addresses found. Add a new address to get started.
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onRemove={() => removeAddress(address._id)}
              onSetDefault={() => setDefaultAddress(address._id)}
              onEdit={() => navigateToEditAddress(address)}
            />
          ))
        )}
      </div>
    </div>
  );
}