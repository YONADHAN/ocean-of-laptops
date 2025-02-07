// import React from 'react';
// import Navbar from './PublicNavbar';
// import Footer from './Footer';
// import Banner from '../UserComponents/Banner/PublicBanner';
// import ProductCollection from './PublicProductCollection';

// const HomePage = () => {
//   return (
//     <div>
//       <Navbar />
//       <div className="w-full h-20"></div>

//       {/* Hero Banner */}
//       <Banner />

//       {/* Professional Exploration Prompt Section */}
//       <div className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-2xl font-bold sm:text-4xl">
//             Discover Our Premium Laptop Collection
//           </h2>
//           <p className="mt-4 text-lg">
//             Join our community to access exclusive offers, personalized recommendations, and cutting-edge technology updates.
//           </p>
//           <div className="mt-8 flex justify-center">
//             <a
//               href="/user/signin"
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300 ease-in-out"
//             >
//               Explore Now
//             </a>
//             <a
//               href="/user/signup"
//               className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 transition-colors duration-300 ease-in-out"
//             >
//               Create Account
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Product Collections */}
//       <ProductCollection categoryId={"674eb9681b18926c0b1b655f"} categoryName={"Latest Collection"} fromLandingPage = {true}/>
//       <ProductCollection categoryId={"674eb91c1b18926c0b1b6559"} categoryName={"New Arrival"} fromLandingPage = {true}/>
  

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default HomePage;


import React from 'react';
import Banner from '../UserComponents/Banner/Banner';
// import ProductCollection from '../UserComponents/products/ProductCollection';
import Navbar from './PublicNavbar';
import Footer from './Footer';
// import ComparisonModule from '../../MainComponents/ComparisonModule'


const HomePage = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <Banner/>
      
      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Our Laptops?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-500 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl  font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Military-grade durability and premium materials ensure long-lasting performance</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-500 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Support</h3>
              <p className="text-gray-600">24/7 technical support and on-site service within 24 hours</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-500 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3-Year Warranty</h3>
              <p className="text-gray-600">Comprehensive warranty covering parts and accidental damage</p>
            </div>
          </div>
        </div>
      </section>

   

      {/* Tech Specs Highlight */}
      <section className="py-16 bg-blue-900 text-white mb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Cutting-Edge Technology</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Latest Gen Intel® Core™ & AMD Ryzen™ Processors
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  NVIDIA® GeForce RTX™ & AMD Radeon™ Graphics
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Ultra-Fast PCIe NVMe SSD Storage
                </li>
              </ul>
            </div>
            <div className="relative h-96 bg-gray-800 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80" 
                alt="Laptop internals"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* <ComparisonModule/> */}

         {/* Product Collections */}
         {/* <section className="py-16 px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto ">
          <ProductCollection 
            categoryId="67a1923c9c5f0b81f4f72080" 
            categoryName="Gaming Laptops"
            description="Extreme performance for professional gamers and content creators"
          />
          <ProductCollection 
            categoryId="67a192539c5f0b81f4f72089" 
            categoryName="Student Laptops"
            description="Lightweight and durable with all-day battery life"
          />
          <ProductCollection 
            categoryId="67a1926a9c5f0b81f4f72092" 
            categoryName="Office Laptops" 
            description="Professional-grade security and productivity features"
          />
        </div>
      </section> */}


    </div>
  );
}

export default HomePage;


