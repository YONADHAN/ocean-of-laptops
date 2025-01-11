

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../../../../api/axiosConfig";
import { authService } from "../../../../apiServices/userApiServices";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const PersonalInformationPage = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: null,
    birthday: "",
    mobileNumber: "",
    language: "",
    gender: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState("");

  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (e?.currentTarget) {
      const { width, height } = e.currentTarget;
      const crop = centerAspectCrop(width, height, 1);
      setCrop(crop);
    }
  }

  useEffect(() => {
    initialUserData();
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  const generateBlob = async (canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleSaveCrop = async () => {
    try {
      setIsLoading(true);
      if (!previewCanvasRef.current) {
        throw new Error("No canvas preview available");
      }

      const blob = await generateBlob(previewCanvasRef.current);
      if (!blob) {
        throw new Error("Failed to generate blob");
      }

      const cloudinaryUrl = await uploadToCloudinary(blob);
      setFormData((prev) => ({ ...prev, profilePic: cloudinaryUrl }));
      setShowCropModal(false);
      setImgSrc("");
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error saving cropped image:", error);
      toast.error("Failed to save cropped image");
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of your existing code for initialUserData, uploadToCloudinary, etc.)

  const initialUserData = async () => {
    try {
      // const token = Cookies.get('user_access_token');
      const token = Cookies.get("access_token");
      const decode = jwtDecode(token);
      const userId = decode._id;
      // const response = await axiosInstance.post("/user_details", { userId });
      const response = await authService.getUserDetails(userId);

      if (!response.data?.success) {
        toast.error("Failed to fetch user data");
        return;
      }

      const userData = response.data.user;
      setFormData({
        name: userData.username || "",
        email: userData.email || "",
        profilePic: userData.avatar || null,
        birthday: userData.birthday
          ? new Date(userData.birthday).toISOString().split("T")[0]
          : "",
        mobileNumber: userData.phone || "",
        language: userData.language || "",
        gender: userData.gender || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.response?.data?.message || "Error fetching user data");
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "LAPTOPHUB");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dndvg7z6d/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setLocalProfilePic(e.target.result);
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, profilePic: cloudinaryUrl }));
      // setLocalProfilePic(null);

      toast.success("Profile picture uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      // setLocalProfilePic(null);
    } finally {
      setIsLoading(false);
    }
  };
  const validation = (formData) => {
    const errors = {};
    let isValid = true;
  
    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z ]+$/.test(formData.name)) {
      errors.name = "Name should only contain letters and spaces";
      isValid = false;
    }
  
    // Email validation removed since it's not editable
    
    if (formData.birthday) {
      if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(formData.birthday)) {
        errors.birthday = "Please enter a valid date (YYYY-MM-DD)";
        isValid = false;
      }
      const [year, month, day] = formData.birthday.split("-");
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const currentDate = new Date();
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const m = currentDate.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 12) {
        errors.birthday = "You must be at least 12 years old";
        isValid = false;
      } else if (age > 100) {
        errors.birthday = "You must be at most 100 years old";
        isValid = false;
      }
    }
  
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Please enter a valid 10-digit phone number";
      isValid = false;
    }
  
    if (formData.language && !/^[a-zA-Z]+$/.test(formData.language)) {
      errors.language = "Language should only contain letters";
      isValid = false;
    }
  
    return { errors, isValid };
  };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const { errors: validationErrors, isValid } = validation(formData);
        if (!isValid) {
          setErrors(validationErrors);
          toast.error("Please fix the form errors");
          return;
        }
    
        setIsLoading(true);
        const token = Cookies.get("access_token");
        const decode = jwtDecode(token);
        const userId = decode._id;
    
        const updateData = {
          userId,
          username: formData.name.trim(),
          email: formData.email.trim(), // This will be the non-editable email
          avatar: formData.profilePic,
          birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null,
          phone: formData.mobileNumber.trim(),
          language: formData.language.trim(),
          gender: formData.gender,
        };
    
        //const response = await axiosInstance.post("/update_personal", updateData);
        const response = await authService.updatePersonal(updateData);
        if (response.status === 200) {
          toast.success("Profile updated successfully");
          navigate("/user/features/account/personal_info");
        } else {
          throw new Error(response.data?.message || "Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(error.response?.data?.message || "Error updating profile");
      } finally {
        setIsLoading(false);
      }
    };
    
  
 

    const handleCancel = () => {
      initialUserData();
      toast.info("Changes cancelled");
      navigate('/user/features/account/personal_info')
      setLocalProfilePic(null);
      
     
    };

    const emailNotEditableMessage = () => {
      toast.info("Email is not editable");
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-2">
        {showCropModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">Crop Profile Picture</h2>
              <div className="max-h-[60vh] overflow-auto">
                {Boolean(imgSrc) && (
                  <div className="flex flex-col items-center">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={1}
                      circularCrop
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="max-h-[60vh] object-contain"
                      />
                    </ReactCrop>
                    <div className="mt-4">
                      <canvas
                        ref={previewCanvasRef}
                        className="w-[150px] h-[150px] rounded-full"
                        style={{
                          border: "1px solid black",
                          objectFit: "contain",
                          display: !completedCrop ? "none" : "block",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setImgSrc("");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={
                    isLoading || !completedCrop?.width || !completedCrop?.height
                  }
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest of your existing JSX for the form */}
        <div className="bg-white pb-16 p-8 rounded-lg shadow-md w-full max-w-4xl flex flex-col md:flex-row gap-8">
          {/* Profile Picture Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-8 mt-6 text-center">
              Personal Information
            </h1>

            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading}
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onSelectFile}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Rest of your form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name}</div>
                )}
              </div>

              <div onClick={emailNotEditableMessage} className="select-none">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  //not editable

                  disabled
                  value={formData.email}
                  // onChange={handleInputChange}

                  className="mt-1 select-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-300"
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email}</div>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1">
            <div className="space-y-4 mt-20">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birthday
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.birthday && (
                  <div className="text-red-500">{errors.birthday}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.mobileNumber && (
                  <div className="text-red-500">{errors.mobileNumber}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.language && (
                  <div className="text-red-500">{errors.language}</div>
                )}
              </div>
            </div>

            <div>
              <div className="mt-9 flex justify-end gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default PersonalInformationPage;
