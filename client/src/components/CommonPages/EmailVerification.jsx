// import React, { useState } from "react";
// import { axiosInstance } from "../../api/axiosConfig";
// import { authService} from '../../apiServices/adminApiServices';
// import Cookies from "js-cookie";
// import {jwtDecode} from "jwt-decode"; 
// import { useNavigate } from "react-router-dom";
// import {toast} from 'sonner'

// const EmailVerification = ({linkFrom = "security" ,role = "user"}) => {
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const navigate = useNavigate();

//   const handleEmailVerification = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const email = formData.get("email").toLowerCase();
//     if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return false;
//   }
//     try {
//       if(linkFrom === "signin"){
//        try {
//         let link = '';
//         if(role === "admin") {
//           link = "/admin/request-password-reset-from-signin"
//         }else {
//           link = "/request-password-reset-from-signin"
//         }
//         console.log(link)
//         const response = await axiosInstance.post(link, {          
//           email,
//         });
        
//         // const response = await axiosInstance.post("/request-password-reset-from-signin", {          
//         //   email,
//         // });
//         if (response.data.success) {
          
//           setSuccessMessage("A verification email has been sent. Please check your inbox.");       
//         }
//        } catch (error) {
//         setErrorMessage(error.message);
//        }
//         return ;
//       }
//       const token = Cookies.get("access_token");
//       if (!token) {
//         setErrorMessage("Please log in first.");
//         return;
//       }

//       const decoded = jwtDecode(token);
//       const userId = decoded._id;
      

//       // const response = await axiosInstance.post("/request-password-reset", {
//       //   userId,
//       //   email,
//       // });
//       const data = {
//         userId,
//         email
//       }
//       const response = await authService.requestPasswordReset(data);//given from adminApi Service

//       if (response.data.success) {
//         setErrorMessage("");
//         setSuccessMessage("A verification email has been sent. Please check your inbox.");
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "Email verification failed.");
//       setSuccessMessage("");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg flex overflow-hidden">
//         <div className="w-1/2 bg-blue-50 p-8 hidden md:flex items-center justify-center">
//           <img
//             src="/forgetpassword.jpg"
//             alt="Reset Password Illustration"
//             className="max-w-full h-auto"
//           />
//         </div>
//         <div className="w-full md:w-1/2 p-8">
//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
//             <p className="text-gray-600">
//               Please enter your registered email address to verify your account.
//             </p>
//             {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
//             {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
//             <form onSubmit={handleEmailVerification} className="space-y-4" noValidate>
//               <div className="space-y-2">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Enter your registered email"
//                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Verify Email
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailVerification;




import React, { useState } from "react";
import { axiosInstance } from "../../api/axiosConfig";
import { authService } from "../../apiServices/adminApiServices";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EmailVerification = ({ linkFrom = "security", role = "user" }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state added
  const navigate = useNavigate();

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.target);
    const email = formData.get("email").toLowerCase();

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false); // ❌ Stop loading if validation fails
      return;
    }

    try {
      let link = "";
      if (linkFrom === "signin") {
        link = role === "admin" ? "/admin/request-password-reset-from-signin" : "/request-password-reset-from-signin";
        const response = await axiosInstance.post(link, { email });

        if (response.data.success) {
          setSuccessMessage("A verification email has been sent. Please check your inbox.");
          toast.success("Verification email sent.");
        }
      } else {
        const token = Cookies.get("access_token");
        if (!token) {
          setErrorMessage("Please log in first.");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded._id;
        const data = { userId, email };

        const response = await authService.requestPasswordReset(data);
        if (response.data.success) {
          setSuccessMessage("A verification email has been sent. Please check your inbox.");
          toast.success("Verification email sent.");
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Email verification failed.");
      toast.error("Email verification failed.");
    } finally {
      setLoading(false); // ✅ Stop loading after API call
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg flex overflow-hidden">
        <div className="w-1/2 bg-blue-50 p-8 hidden md:flex items-center justify-center">
          <img src="/forgetpassword.jpg" alt="Reset Password Illustration" className="max-w-full h-auto" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-600">Please enter your registered email address to verify your account.</p>

            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}

            <form onSubmit={handleEmailVerification} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading} // ✅ Disable input when loading
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                disabled={loading} // ✅ Disable button when loading
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
