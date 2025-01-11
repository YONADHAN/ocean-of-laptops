import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { axiosInstance } from "../../api/axiosConfig";
import Cookies from "js-cookie"; // Importing js-cookie for cookie management
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router

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

                console.log("Sign-in successful:", message);
                console.log("User access token is:", accessToken);

                // Display success toast message
                toast.success(message);

                // Store access token in cookies (or localStorage if preferred)
                // Cookies.set(`${role}_access_token`, accessToken, {//##################################This is to be removed #################################
                //     expires: 1, // Expires in 1 day
                //     secure: true, // Use `true` if serving over HTTPS
                //     sameSite: "Strict",
                // });
                Cookies.set(`access_token`, accessToken, {//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%This is needed to be done%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                    expires: 1, // Expires in 1 day
                    secure: true, // Use `true` if serving over HTTPS
                    sameSite: "Strict",
                });

                // Navigate to the user or admin home page based on role
                if (role === "user") {
                    navigate("/user/home");
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
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
            theme={isDarkMode ? "filled_black" : "outline"}
            size="large"
            shape="rectangular"
            text="continue_with"            
        />
    );
};

export default GoogleAuthButton;
