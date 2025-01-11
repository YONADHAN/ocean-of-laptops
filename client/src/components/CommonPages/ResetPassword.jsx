// ResetPassword.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../api/axiosConfig";
import {toast} from 'sonner';
import Cookies from 'js-cookie'
const ResetPassword = ({linkFrom = "security",role = "user"}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing token.");
      //toast.error("Invalid token")
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setErrorMessage("Password must be at least 8 characters long!");
      return;
    }

    if (
          !/[A-Z]/.test(newPassword) || 
          !/[a-z]/.test(newPassword) || 
          !/[0-9]/.test(newPassword) || 
          !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
      ) {
          toast.error("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.");
          return ;
      }
  
    if(linkFrom === "signin"){
      try {
      
        const response = await axiosInstance.post("/reset-password-from-signin", {
          token,
          newPassword,
        });
       
        if (response.data.success) {
          toast.success("Password reset successfully. Redirecting to login...");
          setSuccessMessage("Password reset successfully. Redirecting to login...");         
          setTimeout(() =>
            {
              if(role ==="admin") {
                navigate("/admin/signin")
              }else {
                navigate("/user/signin")
              }
            },
           3000); 
        }
      } catch (error) {
        toast.error( "Failed to reset password.");
        setErrorMessage(error.response?.data?.message || "Failed to reset password.");
      }
      return;
    }

    try {
      const response = await axiosInstance.post("/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccessMessage("Password reset successfully. Redirecting to login...");
        toast.success("Password reset successfully")
        Cookies.remove("access_token");
        Cookies.remove("RefreshToken");
        setTimeout(() => navigate("/user/signin"), 3000);
      }
    } catch (error) {
      toast.error(
         "Failed to reset password."
      );
      setErrorMessage(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg flex overflow-hidden">
        <div className="w-1/2 bg-blue-50 p-8 hidden md:flex items-center justify-center">
          <img
            src="/forgetpassword.jpg"
            alt="Reset Password Illustration"
            className="max-w-full h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
            <p className="text-gray-600">
              {successMessage
                ? "Your password has been successfully reset."
                : "Please enter your new password."}
            </p>
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
            {!successMessage && (
              <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
