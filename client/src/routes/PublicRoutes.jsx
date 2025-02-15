import { Route, Routes } from 'react-router-dom';
import Error404Page from '../pages/others/Error404';
import About from '../components/PublicPages/AboutPage';
import Home from '../components/MainUserComponents/MainPages/HomePage';
import ProductDetailPage from '../components/MainUserComponents/MainPages/ProductDetailsPage';
import CollectionPage from "../components/MainUserComponents/MainPages/CollectionPage";
import Filter from '../components/MainUserComponents/MainPages/productFilterPage/ProductFilterPage'
import UserFeatureLayout from '../pages/user/UserFeatureLayout';
import Roughtwork from '../pages/PublicPage/routhwork'
import NewShopPage from '../pages/PublicPage/newShopPage/NewShopPage'
const PublicRoutes = () => {
  return (
    <Routes>   
       <Route path='/' element={<UserFeatureLayout/>}> 
            <Route index element={<Home/>}/>                  
            <Route path='product_detail/:id' element={<ProductDetailPage/>}/>                   
            {/* <Route path='shop' element={<Filter/>}/>     */}
            <Route path='shop' element={<NewShopPage/>}/> 
            <Route path='collections' element={<CollectionPage/>}/>
            <Route path="about" element={<About />} />  


            <Route path='waste' element={<Roughtwork/>}/>
                                                  
      </Route>     
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
};

export default PublicRoutes;
