



import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../api/axiosConfig'; 
import {authService} from '../../../apiServices/adminApiServices'
// Update the path as necessary
import Cookies from 'js-cookie';
import { Toaster, toast } from 'sonner';

const AdminSignin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isDarkMode = false;


  const validation = (email, password) => {
    if (email.trim().length === 0 && password.trim().length === 0) {
        toast.error("Please enter an email address and a password");
        return false;
    }

    if (password.trim().length < 8) {
        toast.error("Password should be at least 8 characters long.");
        return false;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        toast.error("Please enter a valid email address.");
        return false;
    }

    if (
        !/[A-Z]/.test(password) || 
        !/[a-z]/.test(password) || 
        !/[0-9]/.test(password) || 
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
        toast.error("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return false;
    }

    return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
   
    try {
      const isValid = validation(email, password);
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      const data = {
        email:email.toLowerCase().trim(), 
        password,
        remember: rememberMe,
      }

      const response = await authService.adminSignIn(data);

      // const response = await axiosInstance.post('/admin/admin_signin', { 
      //   email:email.toLowerCase().trim(), 
      //   password,
      //   remember: rememberMe,
      // });
      

      if (response?.data?.success) {
        const accessToken = response?.data?.accessToken;

        if (!accessToken) {
          throw new Error("Access token not provided in response.");
        }

        toast.success("Sign-in successful");

        // Cookies.set('admin_access_token', accessToken, { 
        //   expires: rememberMe ? 13 : 1,
        //   secure: false, 
        //   sameSite: 'Strict', 
        //   // path: '' 
        // });
        Cookies.set('access_token', accessToken, { 
          expires:  1/96,
          secure: false, 
          sameSite: 'Strict', 
          // path: '' 
        });

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        throw new Error(response?.data?.message || "Sign-in failed");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      const errorMessage = 
        error?.response?.data?.message || 
        // error.message || 
        "An error occurred during sign-in.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex justify-center ${isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-b from-gray-100 to-gray-200"}`}>
      <Toaster richColors position="top-right" />
      <div className="container mx-auto flex items-center justify-center px-16">
        <div className={`max-w-md mx-auto rounded-lg shadow-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-8">
            <h2 className={`text-3xl text-center font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Welcome Back!</h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"} focus:outline-none`}
                    //required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"} focus:outline-none`}
                    //required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  {/* <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  /> */}
                  {/* <label htmlFor="remember-me" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Remember me</label> */}
                </div>
                <a href="/admin/verify_email" className="text-sm text-blue-500 hover:text-blue-800">Forgot your password?</a>
              </div>
              <button
                type="submit"
                className={`w-full py-2 rounded ${isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"} hover:bg-blue-700`}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;
