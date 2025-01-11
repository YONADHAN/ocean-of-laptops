import React, { useState } from "react";
import {axiosInstance} from '../../api/axiosConfig'
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import {toast} from 'sonner'
import {useNavigate} from 'react-router-dom'
const ResetPasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must include uppercase, lowercase, number, and special character.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    const token = Cookies.get('access_token');
    const decode = jwtDecode(token);
    const userId = decode._id;
    if(!userId) {
        toast("Token not found.");
      return;
    }
    try {
      const response = await axiosInstance.post("/password-change", {
        userId: userId, 
        oldPassword: currentPassword,
        newPassword,
      });

      if (response.status === 200) {
       toast.success("Password changed successfully!");
      }
      navigate('/user/shop')
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="h-11/12 bg-gray-100 justify-center place-items-center flex">
      <div className="flex h-4/6 w-4/6 ">
        {/* Left side - Image */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/resetPassword.jpg')" }}
        ></div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Reset Password
            </h2>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm mb-4">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
