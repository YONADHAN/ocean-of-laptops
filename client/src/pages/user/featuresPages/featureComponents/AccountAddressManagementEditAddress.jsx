import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../../../api/axiosConfig';
import {authService} from '../../../../apiServices/userApiServices'
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import AddressForm from './AccountAddressManagementAddressForm';

const EditAddress = ({ redirectToCheckout = false, onSuccess, addressFromCheckout }) => {
 
  const navigate = useNavigate();
  let {id }= useParams();
  
  
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);

  useEffect(() => {
   
    if (location.state?.address) {
      setAddress(location.state.address);
     
      setIsLoading(false);
    } else {
     
     setAddress(addressFromCheckout)
   
     setIsLoading(false)
     
    }
  }, [id, location.state, addressFromCheckout]);


  if(redirectToCheckout && redirectToCheckout === true){
    id = addressFromCheckout._id;    
  }





  const handleEditAddress = async (updatedAddress) => {
    try {
      
      const token = Cookies.get('access_token');
      if (!token) {
        toast.error('Please login to continue');
        
        return;
      }
   

      await authService.editAddress(id, updatedAddress); 

      toast.success('Address updated successfully');
      //navigate('/user/features/account/addresses');
      if (onSuccess) onSuccess();
      navigate(redirectToCheckout ? '/user/features/cart/checkout' : '/user/features/account/addresses');
    } catch (error) {
      //console.error('Error updating address:', error);
      toast.error(error.response?.data?.message || 'Failed to update address');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-600">Loading address details...</div>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Address not found</p>
          <button
            onClick={() => navigate('/user/features/account/addresses')}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Return to addresses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Address</h1>
      <AddressForm 
        purpose={"edit_address"}
        initialData={address} 
        onSubmit={handleEditAddress}
        isEditing={true}
      />
    </div>
  );
};

export default EditAddress;