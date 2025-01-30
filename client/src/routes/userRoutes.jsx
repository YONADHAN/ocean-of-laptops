import {Routes, Route} from 'react-router-dom';
import PublicRoute from '../utils/ProtectRoutes/PublicRoute';
import PrivateRoute from '../utils/ProtectRoutes/PrivateRoute';
import UserLayout from '../pages/user/UserLayout';
import UserSignin from '../pages/user/authPages/UserSignin';
import UserSignup from '../pages/user/authPages/UserSignup';
import Home from '../components/MainUserComponents/MainPages/HomePage';
import ProductDetailPage from '../components/MainUserComponents/MainPages/ProductDetailsPage';
// import ShopPage from '../components/MainUserComponents/MainPages/ShopPage';
import CollectionPage from "../components/MainUserComponents/MainPages/CollectionPage";
import AboutUs from '../components/MainUserComponents/MainPages/AboutPage';
import Error404Page from '../pages/others/Error404'
import PaymentFailure from '../pages/others/PaymentFailure'
import Filter from '../components/MainUserComponents/MainPages/productFilterPage/ProductFilterPage'



//features
import UserFeatureLayout from '../pages/user/UserFeatureLayout';
import Dashboard from '../pages/user/featuresPages/Dashboard';
import Account from '../pages/user/featuresPages/AccountDetails';
import Order from '../pages/user/featuresPages/OrderHistory';
import Cart from '../pages/user/featuresPages/ShoppingCart';
import Wishlist from '../pages/user/featuresPages/Wishlist';
import Wallet from '../pages/user/featuresPages/Wallet';
import Coupon from '../pages/user/featuresPages/Coupon';
import Contact from '../pages/user/featuresPages/ContactUs';
import Settings from '../pages/user/featuresPages/Settings';




//features/account
import AccountLayout from '../pages/user/featuresPages/featureComponents/common/Layouts/AccountLayout'
import PersonalInfo from '../pages/user/featuresPages/featureComponents/AccountPersonalInformation'
import AddressManagement from '../pages/user/featuresPages/featureComponents/AccountAddressManagement'
import PaymentInformation from '../pages/user/featuresPages/featureComponents/AccountPaymentInformation'
import AccountPreferences from '../pages/user/featuresPages/featureComponents/AccountPreferences'
import PrivacyAndSecurity from '../pages/user/featuresPages/featureComponents/AccountPrivacyAndSecurity'
// //features/account/personalInfo/forgotPassword
// import ForgotPassword from '../components/CommonPages/ForgotPassword'

//features/account/AddressManagement/
import AddressManagementAddAddress from '../pages/user/featuresPages/featureComponents/AccountAddressManagementAddAddress'
import AddressManagementEditAddress from '../pages/user/featuresPages/featureComponents/AccountAddressManagementEditAddress'
//features/account/personalInfo/editAddressManagement
import PersonalInfoEditAddress from '../pages/user/featuresPages/featureComponents/AccountPersonalInformationEdit';


//features/account/security/
import EmailVerification from '../components/CommonPages/EmailVerification'
import ResetPassword from '../components/CommonPages/ResetPassword'
import ChangePassword from '../components/CommonPages/ChangePassword'

//features/cart
import CartLayout from '../pages/user/featuresPages/featureComponents/common/Layouts/CartLayout'
import Checkout from '../pages/user/featuresPages/featureComponents/CartCheckoutPage'

//features/order
import OrderLayout from '../pages/user/featuresPages/featureComponents/common/Layouts/OrderLayout';
import OrderConfirmation from '../pages/user/featuresPages/featureComponents/OrderConfirmation';
import TrackMyOrderAndCancel from '../pages/user/featuresPages/featureComponents/OrderTrackMyOrderAndCancel';

const UserRoutes = () => {
    return (
        <>
            <Routes>                
                <Route                    
                    path = "signin"
                    element = {
                        <PublicRoute >
                            <UserSignin/>
                        </PublicRoute>
                    }                
                />
                <Route                    
                    path = "signup"
                    element = {
                        <PublicRoute>
                            <UserSignup/>
                        </PublicRoute>
                    }                
                />
                <Route                    
                    path = "landingPage"
                    element = {
                        <PublicRoute >
                            <Home/>                            
                        </PublicRoute>
                    }                
                />
                  <Route                    
                    path = "verify-email-signin"
                    element = {
                        <PublicRoute >
                            <EmailVerification linkFrom = "signin"/>                            
                        </PublicRoute>
                    }                
                />
                  <Route                    
                    path = "reset_password_signin"
                    element = {
                        <PublicRoute >
                            <ResetPassword linkFrom="signin"/>                            
                        </PublicRoute>
                    }                
                />
                <Route path='/' element={<PrivateRoute allowedRole="user" redirectTo="/user/signin"><UserFeatureLayout/></PrivateRoute>}>                
                    <Route path='product_detail/:id' element={<ProductDetailPage/>}/>                   
                    <Route path='shop' element={<Filter/>}/>              
                    <Route path='collections' element={<CollectionPage/>}/>
                    <Route path='about' element={<AboutUs/>}/>   
                    <Route path='home' element={<Home/>}/>  
                    <Route path='filter' element={<Filter/>}/>                          
                </Route>
                <Route path='/features' element={<PrivateRoute allowedRole="user" redirectTo="/user/signin"><UserFeatureLayout/></PrivateRoute>}>
                    <Route path='dashboard' element={<Dashboard/>}/>
                    <Route path="account" element={<AccountLayout/>}>
                        <Route index element={<Account />} />             
                        <Route path="personal_info" element={<PersonalInfo />} />
                        <Route path='personal_info/edit' element = {<PersonalInfoEditAddress/>}/>                       
                        <Route path="addresses" element={<AddressManagement />} />
                        <Route path='addresses/add'element={<AddressManagementAddAddress/>}/>
                        <Route path='addresses/edit/:id' element={<AddressManagementEditAddress/>}/>
                        <Route path="payment" element={<PaymentInformation />} />
                        <Route path="preferences" element={<AccountPreferences />} />
                        <Route path="security" element={<PrivacyAndSecurity />} />
                        <Route path="security/verify-email" element={<EmailVerification />} />
                        <Route path="security/reset-password" element={<ResetPassword />} /> 
                        <Route path='security/change-password' element={<ChangePassword/>}/>   
                    </Route>
                    <Route path='order' element={<OrderLayout/>}> 
                        <Route index element={<Order/>}/>
                        <Route path='trackMyOrderAndCancel/:orderId' element={<TrackMyOrderAndCancel/>}/>                        
                    </Route>
                    <Route path='cart' element={<CartLayout/>}>
                        <Route index element={<Cart/>}/>
                        <Route path='checkout' element={<Checkout/>}/>
                        <Route path='checkout/confirmation/:orderId' element={<OrderConfirmation/>} />
                        <Route path ='checkout/payment-failure' element = {<PaymentFailure/>}/>
                    </Route>                    
                    <Route path='wishlist' element={<Wishlist/>}/>  
                    <Route path='wallet' element={<Wallet/>}/>  
                    <Route path='coupon' element={<Coupon/>}/>
                    <Route path='contact_us' element={<Contact/>}/>   
                    <Route path='settings' element={<Settings/>}/>                         
                </Route>
                <Route path="*" element={<Error404Page />} />
            </Routes>        
        </>
    )
}

export default UserRoutes;