

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import GoogleButton from "../../../utils/GoogleAuth/GoogleAuthButton";
import {authService} from '../../../apiServices/userApiServices';

const Input = ({ icon, ...props }) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </span>
    )}
    <input
      {...props}
      className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`w-full py-2 px-4 rounded-md transition duration-300 ${className}`}
  >
    {children}
  </button>
);

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let interval;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal,timer]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = (formData) => {
    // Username validation
    if (!formData.username.trim()) {
      toast.error("Username is required.");
      return false;
    }
    if (formData.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Password validation
    if (!formData.password.trim()) {
      toast.error("Password is required.");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }
    
    // Check for password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must include uppercase, lowercase, number, and special character.");
      return false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      toast.error("Phone number is required.");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
    };

    

    // Validate form before submission
    if (!validateForm(updatedFormData)) {
      return;
    }

    setIsLoading(true);
    try {
      // const response = await axios.post(
      //   "http://localhost:3000/user_signup",
      //   formData,
      //   {
      //     withCredentials: true,
      //   }
      // );

      // const response  = await authService.signup(formData);
      const response  = await authService.signup(updatedFormData);
      if (response.data.success) {
        setShowOtpModal(true);
        setTimer(120);
        setIsResendDisabled(true);
      } else {
        toast.error(response.data.message || "Signup failed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Network error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    // OTP validation
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }
    
    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    try {
      const email = formData.email;
      // const response = await axios.post("http://localhost:3000/verify_otp", {
      //   email,
      //   otp,
      // });
      const response = await authService.verifyOtp({ email, otp });

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        setShowOtpModal(false);
        navigate("/user/signin");
      }
    } catch (error) {
      toast.error(
       // error.response?.data?.message || 
        "OTP verification failed."
      );
    }
  };

  const handleResendOtp = async () => {
    if (!isResendDisabled) {
      try {
        // const response = await axios.post("http://localhost:3000/resent_otp", {
        //   email: formData.email,
        // });
        const response = await authService.resendOtp({ email: formData.email });

        if (response.data.success) {
          toast.info("OTP has been sent to your mobile phone. Please verify.");
          setTimer(120);
          setIsResendDisabled(true);
          setOtp(""); // Clear previous OTP
        } else {
          toast.error(response.data.message || "Failed to resend OTP");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Network error occurred."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      {/* <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      /> */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Create Your Account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                icon={<FaUser />}
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <Input
                icon={<FaEnvelope />}
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="relative">
                <Input
                  icon={<FaLock />}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Input
                icon={<FaPhone />}
                name="phone"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gray-600 text-white hover:bg-gray-700"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
           
            <GoogleButton role="user" isDarkMode={false} />
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/user/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-300 ease-in-out"
              >
                Sign in
              </a>
            </p>
          </div>
          <div className="w-full md:w-1/2 relative overflow-hidden">
            <img
              src="/signup_laptop_right_side_image.jpg"
              alt="Latest Laptop Models"
              className="absolute inset-0 w-full h-full object-cover transition duration-700 ease-in-out transform hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h2 className="text-3xl font-bold mb-3">
                Discover Amazing Laptops
              </h2>
              <p className="text-lg mb-4">
                Sign up now to explore our wide range of high-performance
                laptops!
              </p>
            </div>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Verify OTP</h2>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <Input
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-center text-sm text-gray-600">
                Time remaining: {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? "0" : ""}
                {timer % 60}
              </p>
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Verify OTP
              </Button>
            </form>
            <div
              className={`text-center text-sm mt-1 ${
                isResendDisabled 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-blue-600 cursor-pointer hover:underline"
              }`}
              onClick={handleResendOtp}
            >
              Resend OTP
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;