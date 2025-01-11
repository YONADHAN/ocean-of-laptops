import Cookies from 'js-cookie';
import { axiosInstance } from './axiosConfig';
import { toast } from 'sonner';

// const attachRequestInterceptor = (axiosCustomInstance) => {
//     axiosCustomInstance.interceptors.request.use(
//         (config) => {
//             if(config.url.includes("cloudinary.com")) {
//                 config.withCredentials = false;
//                 return config;
//             }
//             const adminAccessToken = Cookies.get("admin_access_token");
//             const userAccessToken = Cookies.get("user_access_token");
            
//             const token = adminAccessToken || 
//                          userAccessToken || 
//                          null;
//             console.log("TOKEN", token);
//             console.log("AdminTokenis  ", adminAccessToken)
//             console.log("UserTokenis ",userAccessToken)
//             if(token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
            
//             return config;
//         },
//         (error) => Promise.reject(error)
//     );
// };
const attachRequestInterceptor = (axiosCustomInstance) => {
    axiosCustomInstance.interceptors.request.use(
        (config) => {
            // Special handling for Cloudinary URLs
            if(config.url.includes("cloudinary.com")) {
                config.withCredentials = false;
                return config;
            }

            // const adminAccessToken = Cookies.get("admin_access_token");
            // const userAccessToken = Cookies.get("user_access_token");
            // console.log("-----------------------------------------------------------------------1")
            // console.log("Admin Token", adminAccessToken);
            // console.log("User Token", userAccessToken);
            // // Context-based token selection
            // const isAdminRoute = config.url.includes('/admin/');
            // const token = isAdminRoute ? adminAccessToken : userAccessToken;

            const token = Cookies.get('access_token');

            // console.log("Current Route Context:", isAdminRoute ? "admin" : "user");
            console.log("Selected Token", token);
          console.log("-----------------------------------------------------------------------2")

            if(token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log(`Bearer ${token}`)

            return config;
        },
        (error) => Promise.reject(error)
    );
};


const attachResponseInterceptor = async (axiosCustomInstance, refreshEndpoint) => {
    
    axiosCustomInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            console.error("Interceptor Error:", error);
            const originalRequest = error.config;
            
            if (
                error.response?.status === 401 && 
                error.response?.data?.message === 
                    "Token is invalid or expired." && !originalRequest._retry
            ) {
                originalRequest._retry = true;
                
                try {
                    const response = await axiosInstance.post(
                        refreshEndpoint,
                        {},
                        {withCredentials: true}
                    );
                    
                    const { role, access_token } = response.data;
                    
                    // Cookies.set(`${role}_access_token`, access_token, {
                    //     expires: 45 / (24 * 60),
                    // });
                    Cookies.set(`access_token`, access_token, {
                        expires: 45 / (24 * 60),
                    });

                    console.log(`${role}_access_token stored successfully.`);
                    
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return axiosCustomInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh Token Error:", refreshError);
                    
                    // Cookies.remove("admin_access_token");
                    // Cookies.remove("user_access_token");

                    // Cookies.remove("adminRefreshToken");
                    // Cookies.remove("userRefreshToken");

                    Cookies.remove("RefreshToken");
                    Cookies.remove("access_token");
                    
                    toast.info("Your Session has expired. Please sign in again.");
                    
                    const role = error.response?.data?.role || "user";
                    switch (role) {
                        case "user":
                            window.location.href = "/user/signin";
                            break;
                        case "admin":
                            window.location.href = "/admin/signin";
                            break;
                        default:
                            window.location.href = "/";
                    }
                    return Promise.reject(refreshError);
                }
            }
            
            if (
                error.response?.status === 403 && 
                error.response?.data?.message === "No token provided."
            ) {
                console.log("NO TOKEN");
                toast.info("Your session has expired. Please sign in again.");
                window.location.href = "/";
                return Promise.reject(error);
            }
            
            if (
                error.response?.status === 400 && 
                error.response?.data?.message === "Invalide token format."
            ) {
                toast.info("Your session has expired. Please signin in again.");
                window.location.href = "/";
                return Promise.reject(error);
            }

            
            
            return Promise.reject(error);
        }
    );
};

export { attachRequestInterceptor, attachResponseInterceptor };