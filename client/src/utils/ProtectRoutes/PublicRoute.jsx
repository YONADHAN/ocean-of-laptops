// import Cookies from "js-cookie";
// import { jwtDecode as jwt_decode } from "jwt-decode";
// import { Navigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const location = useLocation();

//   const getRoleFromToken = (token) => {
//     if (!token) return null;
//     try {
//       const decoded = jwt_decode(token);
//       return decoded?.role;
//     } catch (error) {
//       console.error("Error decoding token or getting role:", error);
//       return null;
//     }
//   };

//   const adminToken = Cookies.get("admin_access_token");
//   const userToken = Cookies.get("user_access_token");

//   const adminRole = getRoleFromToken(adminToken);
//   const userRole = getRoleFromToken(userToken);

//   // Check for specific routes and roles
//   const isAdminRoute = location.pathname.startsWith("/admin");
//   const isUserRoute = location.pathname.startsWith("/user");

//   if (adminRole === "admin" && isAdminRoute) {
//     return <Navigate to="/admin/dashboard" replace />;
//   }

//   if (userRole === "user" && isUserRoute) {
//     return <Navigate to="/user/home" replace />;
//   }

//   return children;
// };

// export default PublicRoute;



import Cookies from "js-cookie";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const location = useLocation();

  const getRoleFromToken = (token) => {
    if (!token) return null;
    try {
      const decoded = jwt_decode(token);
      return decoded?.role;
    } catch (error) {
      console.error("Error decoding token or getting role:", error);
      return null;
    }
  };

  // const adminToken = Cookies.get("admin_access_token");
  // const userToken = Cookies.get("user_access_token");

  // const adminRole = getRoleFromToken(adminToken);
  // const userRole = getRoleFromToken(userToken);

  const Token = Cookies.get("access_token");
  const Role = getRoleFromToken(Token);

  // Check for specific routes and roles
  // const isAdminRoute = location.pathname.startsWith("/admin");
  // const isUserRoute = location.pathname.startsWith("/user");

  // if (adminRole === "admin" && isAdminRoute) {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }

  // if (userRole === "user" && isUserRoute) {
  //   return <Navigate to="/user/home" replace />;
  // }

  if (Role === "admin" ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (Role === "user" ) {
    return <Navigate to="/user/home" replace />;
  }

  return children;
};

export default PublicRoute;
