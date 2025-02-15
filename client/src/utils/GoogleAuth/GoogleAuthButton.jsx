import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { axiosInstance } from "../../api/axiosConfig";
import Cookies from "js-cookie"; 
import { useNavigate } from "react-router-dom"; 

const GoogleAuthButton = ({ onSuccessRedirect, role, isDarkMode }) => {
    const navigate = useNavigate(); // For redirection

    const handleGoogleSuccess = async (response) => {
        try {
            const res = await axiosInstance.post("/auth/google", {
                token: response.credential,
                role,
            });

            if (res.status === 200) {
                const { accessToken, message } = res.data;

                
                toast.success(message);

               
                Cookies.set(`access_token`, accessToken, {
                    expires: 45/1440, 
                    secure: true, 
                    sameSite: "Strict",
                });

                // Navigate to the user or admin home page based on role
                if (role === "user") {
                    navigate("/");
                } else if (role === "admin") {
                    navigate("/admin/dashboard");
                }
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Google sign-in was unsuccessful.";
            toast.error(errorMessage);
            console.error("Google Auth Button error:", errorMessage);
        }
    };

    const handleGoogleFailure = () => {
        toast.error("Google sign-in was unsuccessful.");
    };

    return (
       <div className="w-full">
         <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
            theme={isDarkMode ? "filled_black" : "outline"}
            size="large"
            shape="rectangular"
            text="continue_with"            
        />
       </div>
    );
};

export default GoogleAuthButton;
