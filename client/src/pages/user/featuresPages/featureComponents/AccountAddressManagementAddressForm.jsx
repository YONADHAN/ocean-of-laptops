import React, { useState } from "react";
import { toast } from "sonner";
const ModernAddressForm = ({
  initialData,
  onSubmit,
  purpose = "add_address",
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      country: "India",
      name: "",
      email: "",
      phone: "",
      pincode: "",
      flatHouseNo: "",
      areaStreet: "",
      landmark: "",
      city: "",
      state: "",
      district: "",
      addressType: "home",
      isDefault: false,
      deliveryInstructions: "",
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isDefault: e.target.checked });
  };

  const validate = (formData) => {
    const {
      country,
      name,
      email,
      phone,
      pincode,
      flatHouseNo,
      areaStreet,
      landmark,
      city,
      state,
      district,
    } = formData;
    let isValid = true;
    if (country.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a country");
    }
    if (name.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a full name");
    }
    if (email.trim().length === 0) {
      isValid = false;
      toast.error("Please enter an email");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      isValid = false;
      toast.error("Please enter a valid email address.");
      
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      isValid = false;
      toast.error("Please enter a valid mobile number with exactly 10 digits");
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      isValid = false;
      toast.error("Please enter a valid 6-digit pincode.");
    }
    if (flatHouseNo.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a flat house number");
    }
    if (areaStreet.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a area street");
    }
    if (landmark.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a landmark");
    }

    if (city.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a city");
    }
    if (state.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a state");
    }
    if (district.trim().length === 0) {
      isValid = false;
      toast.error("Please enter a district");
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate(formData);
    if (!isValid) return;
    console.log("form  submit formData : ", formData);
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl space-y-6 transform transition-all duration-300 hover:scale-105"
        noValidate
      >
        <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-8">
          Address Details
        </h1>

        <div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
          {/* Left Column */}
          <div className="md:w-1/2 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Eg: Tony Stark"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                //required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Eg: tony@stark.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                //required
              />
            </div>

            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="10 digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                // required
              />
            </div>

            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Eg: 110001"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                //required
              />
            </div>

            <div>
              <label
                htmlFor="flatHouseNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Flat/House No
              </label>
              <input
                type="text"
                id="flatHouseNo"
                name="flatHouseNo"
                placeholder="Eg: House Name/Flat No/Building Name"
                value={formData.flatHouseNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="areaStreet"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Area/Street
              </label>
              <input
                type="text"
                id="areaStreet"
                name="areaStreet"
                placeholder="Eg: Street Name, Area Name"
                value={formData.areaStreet}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2 space-y-4">
            <div>
              <label
                htmlFor="landmark"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Landmark
              </label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                placeholder="Eg: Near Apollo Hospital"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Eg: Mumbai"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                // required
              />
            </div>

            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                District
              </label>
              <input
                type="text"
                id="district"
                name="district"
                placeholder="Eg: Mumbai Suburban"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                // required
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="Eg: Maharashtra"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                //required
              />
            </div>

            <div>
              <label
                htmlFor="addressType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address Type
              </label>
              <select
                id="addressType"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                //required
              >
                <option value="Temporary Address">Temporary Address</option>
                <option value="Permanent Address">Permanent Address</option>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="office">Office</option>
                <option value="Pickup point">Pickup Point</option>
                <option value="Friends/Relatives">Friends/Relatives</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="deliveryInstructions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Delivery Instructions
              </label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                placeholder="Eg: Call me before delivery"
                onChange={handleChange}
                className="w-full h-[45px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                rows="2"
              />
            </div>
          </div>
        </div>

        {purpose === "add_address" && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Set as default address
            </label>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default ModernAddressForm;
