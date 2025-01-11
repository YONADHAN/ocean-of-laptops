import Cookies from 'js-cookie';
import {Navigate} from 'react-router-dom';


const PrivateRoute = ({allowedRole, redirectTo, children})=> {
    // const accessToken = Cookies.get(`${allowedRole}_access_token`);
    const accessToken = Cookies.get(`access_token`);
  
    const getRoleFromToken = (token) => {
        if(!token) return null;
        try {
            const payload = token.split(".")[1];
            const decodedPayload = atob(payload);
            const decoded = JSON.parse(decodedPayload);
            // console.log(decoded);
            return decoded?.role;
        } catch (error) {
            console.log("Error decoding token or getting role:", error);
            return null;
        }
    };
    const userRole = getRoleFromToken(accessToken);
    const isAuthorized = allowedRole === userRole;
    if(!isAuthorized) {
        return <Navigate to={redirectTo} replace />
    }
    return children;
}

export default PrivateRoute;