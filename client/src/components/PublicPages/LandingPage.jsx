import React from 'react';
import Navbar from './PublicNavbar';
import Footer from './Footer';
import Banner from '../UserComponents/Banner/PublicBanner';
import ProductCollection from './PublicProductCollection';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="w-full h-20"></div>

      {/* Hero Banner */}
      <Banner />

      {/* Professional Exploration Prompt Section */}
      <div className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold sm:text-4xl">
            Discover Our Premium Laptop Collection
          </h2>
          <p className="mt-4 text-lg">
            Join our community to access exclusive offers, personalized recommendations, and cutting-edge technology updates.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="/user/signin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300 ease-in-out"
            >
              Explore Now
            </a>
            <a
              href="/user/signup"
              className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 transition-colors duration-300 ease-in-out"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>

      {/* Product Collections */}
      <ProductCollection categoryId={"674eb9681b18926c0b1b655f"} categoryName={"Latest Collection"} fromLandingPage = {true}/>
      <ProductCollection categoryId={"674eb91c1b18926c0b1b6559"} categoryName={"New Arrival"} fromLandingPage = {true}/>
  

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
