import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-blue-50 min-h-screen">
      

      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-800 mb-6">About Us</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-4">
                At Ocean of Laptops, we've been riding the waves of technology since our inception. Our journey has been marked by a commitment to providing cutting-edge laptops to tech enthusiasts, professionals, and casual users alike.
              </p>
              <p className="text-lg text-gray-700">
                With years of experience in the industry, we've built a reputation for excellence, reliability, and customer satisfaction that sets us apart in the vast sea of tech retailers.
              </p>
            </div>
            <div className="bg-blue-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-lg overflow-hidden h-[260px] "><img src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/Vd3bj2jPe/videoblocks-focused-businessman-working-on-laptop-computer-in-office-with-large-windows-male-worker-using-laptop-computer-at-remote-workplace-serious-business-man-looking-at-laptop-screen-in-home-office_ryl5b7gzfw_thumbnail-1080_01.png" alt="" /></span>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-800 mb-6">Our Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">100,000+ Laptops Sold</h3>
              <p className="text-gray-700">We've successfully supplied over 100,000 laptops to satisfied customers across the country.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">99% Customer Satisfaction</h3>
              <p className="text-gray-700">Our commitment to quality and service has resulted in an industry-leading 99% customer satisfaction rate.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">24/7 Support</h3>
              <p className="text-gray-700">We provide round-the-clock support to ensure our customers always have assistance when they need it.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-800 mb-6">Our Supply Chain</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-blue-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-lg overflow-hidden h-[260px]"><img src="https://convergeconsulting.com/wp-content/uploads/2021/06/Supply-Chain-Visual.jpg" alt="" /></span>
            </div>
            <div>
              <p className="text-lg text-gray-700 mb-4">
                We've established strong partnerships with leading laptop manufacturers and distributors worldwide. This allows us to offer a wide range of high-quality laptops at competitive prices.
              </p>
              <p className="text-lg text-gray-700">
                Our efficient supply chain ensures that we always have the latest models in stock, ready to be delivered to our customers with minimal wait times.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-blue-800 mb-6">Our Loyal Customers</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-4">
              We're proud to have built a loyal customer base that keeps coming back for their laptop needs. From individual consumers to large corporations, our clients trust us for our expertise, quality products, and exceptional service.
            </p>
            <p className="text-lg text-gray-700">
              Many of our customers have been with us since the beginning, and their continued support drives us to maintain our high standards and constantly improve our offerings.
            </p>
          </div>
        </section>
      </main>

     
    </div>
  );
};

export default AboutUs;

