import {Routes, Route} from 'react-router-dom';
import AdminSignin from '../pages/admin/authPages/AdminSignin';
import PublicRoute from '../utils/ProtectRoutes/PublicRoute';
import PrivateRoute from '../utils/ProtectRoutes/PrivateRoute';
import AdminLayout from '../pages/admin/AdminLayout';
import Error404Page from '../pages/others/Error404';

//AdminComponents
// import AdminDashboard from '../components/AdminComponents/Dashboard/AdminDashboardMainComponent';
import AdminDashboard from '../components/AdminComponents/AdminDashboard/AdminMainDashboard';
import AdminSalesReport from '../components/AdminComponents/SalesReport/AdminSalesReport';
import AdminCategory from '../components/AdminComponents/Category/AdminCategoryMainComponent';
import AdminCategoryAdd from '../components/AdminComponents/Category/AdminCategoryAdd';
import AdminCategoryEdit from '../components/AdminComponents/Category/AdminCategoryEdit';
import AdminProducts from '../components/AdminComponents/Products/AdminProductsMainComponent';
import AdminProductAdd from '../components/AdminComponents/Products/AdminProductAdd';
import AdminProductEdit from '../components/AdminComponents/Products/AdminProductEdit';
import AdminCustomers from '../components/AdminComponents/Customers/AdminCustomers';
import AdminOrders from '../components/AdminComponents/Orders/AdminOrders';
import AdminOrderDetails from '../components/AdminComponents/Orders/OrderDetails';
import AdminBanner from '../components/AdminComponents/Banner/AdminBanner';
import AdminCoupon from '../components/AdminComponents/Coupon/AdminCoupon';
import AdminSettings from '../components/AdminComponents/Settings/AdminSettings';

import VerifyEmail from '../components/CommonPages/EmailVerification';
import ResetPassword from '../components/CommonPages/ResetPassword'
const AdminRoutes = () => {
    return (
        <>
            <Routes>                
                <Route                    
                    path = "signin"
                    element = {
                        <PublicRoute >
                            <AdminSignin/>
                        </PublicRoute>
                    }                
                />
                 <Route                    
                    path = "verify_email"
                    element = {
                        <PublicRoute >
                            <VerifyEmail linkFrom = "signin" role= "admin"/>
                        </PublicRoute>
                    }                
                />
                 <Route                    
                    path = "reset_password_signin"
                    element = {
                        <PublicRoute >
                            <ResetPassword linkFrom="signin" role = "admin"/>                            
                        </PublicRoute>
                    }                
                />
                <Route path='/' element={<PrivateRoute allowedRole="admin" redirectTo="/admin/signin"><AdminLayout/></PrivateRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />}/>
                    <Route path='sales_report' element={<AdminSalesReport/>}/>
                    <Route path="category" element={<AdminCategory />} />
                    <Route path='category_add' element={<AdminCategoryAdd/>}/>
                    <Route path='category_edit/:id' element={<AdminCategoryEdit/>}/>
                    <Route path='products' element={<AdminProducts/>} />
                    <Route path='product_add' element={<AdminProductAdd/>}/>
                    <Route path='product_edit/:productId' element={<AdminProductEdit/>}/>
                    <Route path='customers' element={<AdminCustomers/>} />
                    <Route path='orders' element={<AdminOrders/>}/>
                    <Route path='orders/order_details/:orderId' element={<AdminOrderDetails/>}/>
                    <Route path='banner' element={<AdminBanner/>}/>
                    <Route path='coupon' element={<AdminCoupon/>}/>
                    <Route path='settings' element={<AdminSettings/>}/>  
                                  
                </Route>
                <Route path="*" element={<Error404Page />} />
            </Routes>        
        </>
    )
}

export default AdminRoutes;