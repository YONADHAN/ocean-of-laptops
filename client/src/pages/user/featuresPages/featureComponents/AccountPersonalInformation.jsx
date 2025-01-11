import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import {jwtDecode as jwt_decode} from 'jwt-decode';
import { axiosInstance } from '../../../../api/axiosConfig';
import {authService } from '../../../../apiServices/userApiServices'
import ConfirmationAlert from '../../../../components/MainComponents/ConformationAlert';

import {
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaPencilAlt,
  FaKey,
  FaShoppingBag,
  FaWallet,
  FaCalendar,
  FaGlobe,
  FaUser,
} from "react-icons/fa";

const AccountPersonalInformation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditPageAlert, setShowEditPageAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = () => {
    setShowEditPageAlert(false);
    
  };
  const goToForgotPasswordPage = () => {
    // navigate('/user/features/account/personal_info/forget_password')
    navigate('/user/features/account/security/change-password')
  }

  const goToEditProfilePage = () => {
    setShowEditPageAlert(false);
    navigate("/user/features/account/personal_info/edit");
  };

  const fetchData = async () => {
    try {
      // const token = Cookies.get("user_access_token");
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }
      const decoded = jwt_decode(token);
      const userId = decoded._id;
      // const personalData = await axiosInstance.post("/user_details", { userId });
      const personalData = await authService.getUserDetails(userId);
      if (!personalData) {
        toast.error("Failed to fetch user's data");
        return;
      }
      setData(personalData.data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
        <Icon size={16} className="text-blue-600" />
        {label}
      </div>
      <p className="text-lg font-medium text-gray-900">{value || 'N/A'}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="h-48 w-full bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 w-full bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-24 w-full bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
            <h1 className="text-3xl font-bold">My Profile</h1>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32  overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                    
                    {data?.avatar ? (
                      <img 
                        src={data?.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle size={64} className="text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 rounded-full shadow-lg bg-white p-2">
                    <FaPencilAlt size={16} className="text-blue-600"  onClick={() => setShowEditPageAlert(true)}/>
                  </button>
                </div>
              </div>
              <div className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoItem icon={FaUser} label="Name" value={data?.username} />
                  <InfoItem icon={FaPhone} label="Phone" value={data?.phone} />
                  <InfoItem icon={FaEnvelope} label="Email" value={data?.email} />
                  {data?.birthday && <InfoItem icon={FaCalendar} label="Birthday" value={data?.birthday.slice(0,10)?formatDate(data?.birthday.slice(0,10)):""} />}
                  {data?.language && <InfoItem icon={FaGlobe} label="Language" value={data?.language} />}
                  {data?.gender && <InfoItem icon={FaUser} label="Gender" value={data?.gender} />}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center" onClick={() => setShowEditPageAlert(true)}>
                    <FaPencilAlt size={16} className="mr-2" />
                    Edit Profile
                  </button>
                  <button className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-4 rounded border border-blue-200 flex items-center" onClick={goToForgotPasswordPage}>
                    <FaKey size={16} className="mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/user/features/order")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center" >
                <FaShoppingBag size={20} className="mr-2" />
                Order History
              </button>
              <button onClick={() => navigate("/user/features/wallet")} className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-4 rounded border border-blue-200 flex items-center">
                <FaWallet size={20} className="mr-2" />
                My Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationAlert
        show={showEditPageAlert}
        title="Edit Profile"
        message="Are you sure you want to edit your profile?"
        onCancel={handleCancel}
        onProceed={goToEditProfilePage}
        noText="No"
        yesText="Yes"
      />
    </div>
  );
};

export default AccountPersonalInformation;
