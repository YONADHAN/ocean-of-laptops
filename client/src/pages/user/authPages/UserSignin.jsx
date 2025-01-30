import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';
import { axiosInstance } from "../../../api/axiosConfig";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import GoogleButton from "../../../utils/GoogleAuth/GoogleAuthButton";
import { authService } from "../../../apiServices/userApiServices";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!email.trim() && !password.trim()){
        toast.error("Email and password are required");
        return;
      }
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }
      if (!password.trim()) {
        toast.error("Password is required");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }
      if (!password.trim()) {
        toast.error("Password is required.");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must include uppercase, lowercase, number, and special character."
        );
        return;
      }

      const response = await authService.signin({
        email: email.toLowerCase().trim(),
        password,
      });
      if (response.status === 200) {
        console.log(response.data);
        const { accessToken, message } = response.data;
        console.log("user_access_token is :", accessToken);
        console.log("Sign-in successful:", message);
        toast.success("Sign-in successful");

        Cookies.set("access_token", accessToken, {
          expires: 1/96,
          secure: false,
          sameSite: "Strict",
          // path: ''
        });

        navigate("/user/home");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error:", error.message);
        toast.error(error.message);
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Signing in with Google");
  };
  const forgetPasswordEmail = async () => {
    navigate("/user/verify-email-signin");
  };

  const goSignup = () => {
    navigate("/user/signup");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col lg:flex-row w-full max-w-4xl">
        <div className="w-full lg:w-1/2 p-8 ">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="mb-6">You’ve been missed! Let’s get you signed in.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center"></div>

              <p
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                onClick={forgetPasswordEmail}
              >
                Forgot your password?
              </p>
            </div>
            <button
              className="bg-gray-500 mb-2 hover:bg-gray-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log In
            </button>
          </form>

          <GoogleButton role="user" />

          <p className="text-gray-700 mt-4 text-center">
            Don’t have an account?{" "}
            <a
              href="#"
              className="text-blue-500 hover:text-blue-800 font-bold"
              onClick={goSignup}
            >
              Register here
            </a>
          </p>
        </div>

        {/* Right side: Image */}
        <div className="w-full lg:w-1/2 hidden  lg:block">
          <img
            src="http://media.ldlc.com/ld/products/00/04/01/11/LD0004011101_2_0004011196.jpg"
            alt="Sign In"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
