import React from 'react';
import Navbar from '../../MainUserComponents/Navbar';
import Footer from '../../MainUserComponents/Footer';
import Banner from '../../UserComponents/Banner/Banner'
import ProductCollection from '../../UserComponents/products/ProductCollection'
const HomePage = () => {
  return (
    <div>
      {/* <Navbar/> */}
      {/* <div className='w-full h-20'></div> */}
      <Banner/>      
      <ProductCollection categoryId={"674eb91c1b18926c0b1b6559"} categoryName={"Gaming Laptop"}/>
      <ProductCollection categoryId={"674eb94c1b18926c0b1b655c"} categoryName={"Student Laptop"}/>
      <ProductCollection categoryId={"674eb9681b18926c0b1b655f"} categoryName={"Office Laptop"} />
    </div>
  );
}

export default HomePage;
