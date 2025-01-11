import {Outlet} from "react-router-dom";
import Navbar from '../../components/MainUserComponents/Navbar';
import Footer from '../../components/MainUserComponents/Footer';

const UserLayout = () => {
    return (
        <>   
            <Navbar/>         
            <Outlet/>
            <Footer/>
        </>
    )
}

export default UserLayout;