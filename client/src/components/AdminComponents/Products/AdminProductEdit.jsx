import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance } from "../../../api/axiosConfig";
import {
  productService,
  categoryService,
} from "../../../apiServices/adminApiServices";

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    modelNumber: "",
    processor: { brand: "", model: "", generation: "" },
    ram: { size: "", type: "" },
    storage: { type: "", capacity: "" },
    graphics: { model: "", vram: "" },
    display: { size: "", resolution: "", refreshRate: "" },
    operatingSystem: "",
    batteryLife: "",
    weight: "",
    ports: "",
    regularPrice: "",
    offer: "",
    quantity: "",
    description: "",
    category: "",
    size: "",
    color: "",
    status: "Available",
    isBlocked: false,
    popularity: 0,
    rating: 0,
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [imageToCropUrl, setImageToCropUrl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  useEffect(() => {
    setIsLoading(true);
    fetchProductDetails();
    fetchCategories();
    setIsLoading(false);
  }, [productId]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (file && isValidImage(file)) {
      setCurrentFile(file);
      setImageToCropUrl(URL.createObjectURL(file));
      setCurrentIndex(index);
      setModalOpen(true);
    } else {
      toast.error(
        "Invalid file. Only JPEG, PNG, and WEBP under 5MB are allowed."
      );
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropAndSaveImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImage(
        currentFile,
        croppedAreaPixels
      );
      const croppedImageFile = new File([croppedImageBlob], currentFile.name, {
        type: currentFile.type,
      });

      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[currentIndex] = {
          file: croppedImageFile,
          url: URL.createObjectURL(croppedImageFile),
          isNew: true,
        };
        return updatedImages;
      });

      setModalOpen(false);
    } catch (error) {
      console.error("Error cropping the image:", error);
      toast.error("Error cropping the image.");
    }
  };

  const getCroppedImage = async (file, crop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob(resolve, file.type);
      };
    });
  };

  const fetchProductDetails = async () => {
    try {
      // console.log(productId);
      // const response = await axios.get(`http://localhost:3000/admin/get_product/${productId}`);
      // const response = await axiosInstance.get(
      //   `/admin/get_product/${productId}`
      // );
      const response = await productService.getProductById(productId);
      if (response.data.success) {
        setFormData(response.data.product);
        setImages(response.data.product.productImage.map((url) => ({ url })));
      } else {
        toast.error("Failed to fetch product details");
        setError("Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Error fetching product details");
      setError("Error fetching product details");
    }
  };

  const fetchCategories = async () => {
    try {
      // const response = await axios.get('http://localhost:3000/admin/get_category_list');
      // const response = await axiosInstance.get(`/admin/get_category_list`);
      const response = await categoryService.getCategoryList();
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error("Failed to fetch categories");
        setError("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
      setError("Error fetching categories");
    }
  };

  const goback = () => {
    navigate("/admin/products");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData((prevState) => ({
        ...prevState,
        category: {
          _id: value,
          name: categories.find((cat) => cat._id === value)?.name || "",
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleNestedInputChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [parent]: {
        ...prevState[parent],
        [name]: value,
      },
    }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "LAPTOPHUB");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dndvg7z6d/image/upload",
        formData
      );
      console.log(
        "upload to cloudinary coding part--------------------------------"
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      toast.error("Error uploading image ");
      return null;
    }
  };

  const ValidateTheInputs = (formData) => {
    console.log("Validate the inputs : ", JSON.stringify(formData));
    const errors = {};
    let isValid = true;
    if (formData.productName.trim() === "") {
      errors.productName = "Product Name is required";
      isValid = false;
    }
    if (formData.brand.trim() === "") {
      errors.brand = "Brand is required";
      isValid = false;
    }
    if (formData.modelNumber.trim() === "") {
      errors.modelNumber = "Model Number is required";
      isValid = false;
    }
    if (!formData.category) {
      errors.category = "Category is required";
      isValid = false;
    }
    if (formData.processor.brand.trim() === "") {
      errors.processor = { ...errors.processor, brand: "Brand is required" };
      isValid = false;
    }
    if (formData.processor.model.trim() === "") {
      errors.processor = { ...errors.processor, model: "Model is required" };
      isValid = false;
    }
    if (formData.processor.generation.trim() === "") {
      errors.processor = {
        ...errors.processor,
        generation: "Generation is required",
      };
      isValid = false;
    }
    if (formData.ram.size.trim() === "") {
      errors.ram = { ...errors.ram, size: "Size is required" };
      isValid = false;
    }
    if (formData.ram.type.trim() === "") {
      errors.ram = { ...errors.ram, type: "Type is required" };
      isValid = false;
    }
    if (formData.storage.type.trim() === "") {
      errors.storage = { ...errors.storage, type: "Type is required" };
      isValid = false;
    }
    if (formData.storage.capacity.trim() === "") {
      errors.storage = { ...errors.storage, capacity: "Capacity is required" };
      isValid = false;
    }
    if (formData.graphics.model.trim() === "") {
      errors.graphics = { ...errors.graphics, model: "Model is required" };
      isValid = false;
    }
    if (formData.graphics.vram.trim() === "") {
      errors.graphics = { ...errors.graphics, vram: "VRAM is required" };
      isValid = false;
    }
    if (formData.display.size.trim() === "") {
      errors.display = { ...errors.display, size: "Size is required" };
      isValid = false;
    }
    if (formData.display.resolution.trim() === "") {
      errors.display = {
        ...errors.display,
        resolution: "Resolution is required",
      };
      isValid = false;
    }
    if (formData.display.refreshRate.trim() === "") {
      errors.display = {
        ...errors.display,
        refreshRate: "Refresh Rate is required",
      };
      isValid = false;
    }
    if (formData.operatingSystem.trim() === "") {
      errors.operatingSystem = "Operating System is required";
      isValid = false;
    }
    if (formData.batteryLife.trim() === "") {
      errors.batteryLife = "Battery Life is required";
      isValid = false;
    }
    if (formData.weight.trim() === "" || formData.weight < 0) {
      if (formData.weight < 0) {
        errors.weight = "Weight should be greater than 0";
      } else {
        errors.weight = "Weight is required";
      }
      isValid = false;
    }
    if (formData.ports.trim() === "") {
      errors.ports = "Ports are required";
      isValid = false;
    }
    if (!formData.regularPrice || formData.regularPrice < 0) {
      if (formData.regularPrice < 0) {
        errors.regularPrice = "Regular Price should be greater than 0";
      } else {
        errors.regularPrice = "Regular Price is required";
      }

      isValid = false;
    }
    if (!formData.offer || formData.offer < 0) {
      if (formData.offer < 0 || formData.offer >100) {
        errors.offer = "Offer should be greater than 0";
      } else {
        errors.offer = "Offer is required";
      }

      isValid = false;
    }
    if (!formData.quantity || formData.quantity < 0) {
      if (formData.quantity < 0) {
        errors.quantity = "Quantity should be greater than 0";
      } else {
        errors.quantity = "Quantity is required";
      }

      isValid = false;
    }
    if (formData.description.trim() === "") {
      errors.description = "Description is required";
      isValid = false;
    }
    if (formData.size.trim() === "") {
      errors.size = "Size is required";
      isValid = false;
    }
    if (formData.color.trim() === "") {
      errors.color = "Color is required";
      isValid = false;
    }
    return { errors, isValid };
  };

  const isValidImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5 MB
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  // const handleImageChange = (e, index) => {
  //   const file = e.target.files[0];
  //   if (file && isValidImage(file)) {
  //     setImages((prevImages) => {
  //       const updatedImages = [...prevImages];
  //       updatedImages[index] = {
  //         file,
  //         url: URL.createObjectURL(file),
  //         isNew: true,
  //       };
  //       return updatedImages;
  //     });
  //   } else {
  //     toast.error(
  //       "Invalid file. Only JPEG, PNG, and WEBP under 5MB are allowed."
  //     );
  //   }
  // };

  const displayErrors = (errors) => {
    const flattenErrors = (obj, parentKey = "") => {
      let messages = [];
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          messages = messages.concat(
            flattenErrors(obj[key], `${parentKey}${key}.`)
          );
        } else {
          messages.push(`${parentKey}${key}: ${obj[key]}`);
        }
      }
      return messages;
    };

    if (!errors || Object.keys(errors).length === 0) {
      return;
    }

    const errorMessages = flattenErrors(errors);

    errorMessages.forEach((message, index) => {
      setTimeout(() => {
        toast.error(message, { toastId: `${message}-${index}` });
      }, index * 300);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { errors, isValid } = ValidateTheInputs(formData);
    if (!isValid) {
      setError(errors);
      displayErrors(errors);
      console.log(errors);
      return;
    }

    try {
      const imageUrls = await Promise.all(
        images.map(async (img) => {
          if (img?.isNew && img?.file) {
            return await uploadToCloudinary(img.file);
          }
          return img?.url || null;
        })
      );

      const filteredImageUrls = imageUrls.filter((url) => url !== null);
      if (filteredImageUrls.length === 0) {
        toast.error("At least one image is required");
        return;
      }

      const productSubmissionData = {
        ...formData,
        productImage: filteredImageUrls,
      };
      // const response = await axiosInstance.put(
      //   `/admin/update_product/${productId}`,
      //   productSubmissionData
      // );

      const response = await productService.updateProduct(
        productId,
        productSubmissionData
      );

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Error updating product");
      setError(
        error.response?.data?.message ||
          "An error occurred while updating the product"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-800 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>
        <div>
          <Modal
            className="relative min-w-[300px] min-h-[400px] max-w-md bg-white rounded-lg shadow-lg p-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            ariaHideApp={false}
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Crop Image
            </h2>

            {/* Aspect Ratio Selector */}
            <div className="flex justify-center mb-4 space-x-2">
              <button
                onClick={() => setAspectRatio(1)}
                className={`px-4 py-2 rounded-md ${
                  aspectRatio === 1 ? "bg-indigo-600 text-white" : "bg-gray-300"
                }`}
              >
                1:1
              </button>
              <button
                onClick={() => setAspectRatio(16 / 9)}
                className={`px-4 py-2 rounded-md ${
                  aspectRatio === 16 / 9
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                16:9
              </button>
              <button
                onClick={() => setAspectRatio(4 / 3)}
                className={`px-4 py-2 rounded-md ${
                  aspectRatio === 4 / 3
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                4:3
              </button>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="crop-container relative w-full h-[300px]">
                <Cropper
                  image={imageToCropUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio} 
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={true} 
                  zoomWithScroll
                  cropShape="rect" 
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={cropAndSaveImage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </Modal>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                // required
              />
              {/* {error.productName ? (
                <div className="text-red-500">{error.productName}</div>
              ) : null} */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                // required
              />
              {/* {error.brand ? (
                <div className="text-red-500">{error.brand}</div>
              ) : null} */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model Number
              </label>
              <input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                // required
              />
              {/* {error.modelNumber ? (
                <div className="text-red-500">{error.modelNumber}</div>
              ) :null} */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                name="category"
                value={formData.category._id || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                // required
              >
                {/* Default option showing the current category */}
                {formData.category.name && (
                  <option value={formData.category._id}>
                    {formData.category.name}
                  </option>
                )}

                {/* Render other categories */}
                {categories
                  .filter((category) => category._id !== formData.category._id) // Exclude current category
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              {/* {error.category ? (
                <div className="text-red-500">{error.category}</div>
              ) : null} */}
            </div>
          </div>

          {/* Processor Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Processor Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.processor.brand}
                  onChange={(e) => handleNestedInputChange(e, "processor")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Brand</option>
                  <option value="Intel">Intel</option>
                  <option value="AMD">AMD</option>
                  <option value="Apple">Apple</option>
                </select>
                {/* {error.processor?.brand ? (
                  <div className="text-red-500">{error.processor.brand}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.processor.model}
                  onChange={(e) => handleNestedInputChange(e, "processor")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Core i7"
                />
                {/* {error.processor?.model ? (
                  <div className="text-red-500">{error.processor.model}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Generation
                </label>
                <input
                  type="text"
                  name="generation"
                  value={formData.processor.generation}
                  onChange={(e) => handleNestedInputChange(e, "processor")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 12th Gen"
                />
                {/* {error.processor?.generation ? (
                  <div className="text-red-500">
                    {error.processor.generation}
                  </div>
                ) : null} */}
              </div>
            </div>
          </div>

          {/* RAM */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">RAM</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <select
                  name="size"
                  value={formData.ram.size}
                  onChange={(e) => handleNestedInputChange(e, "ram")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Size</option>
                  <option value="4GB">4GB</option>
                  <option value="8GB">8GB</option>
                  <option value="16GB">16GB</option>
                  <option value="32GB">32GB</option>
                </select>
                {/* {error.ram?.size ? (
                  <div className="text-red-500">{error.ram.size}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.ram.type}
                  onChange={(e) => handleNestedInputChange(e, "ram")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Type</option>
                  <option value="DDR4">DDR4</option>
                  <option value="DDR5">DDR5</option>
                  <option value="Unified Memory">Unified Memory</option>
                </select>
                {/* {error.ram?.type ? (
                  <div className="text-red-500">{error.ram.type}</div>
                ) : null} */}
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Storage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.storage.type}
                  onChange={(e) => handleNestedInputChange(e, "storage")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Type</option>
                  <option value="SSD">SSD</option>
                  <option value="HDD">HDD</option>
                </select>
                {/* {error.storage?.type ? (
                  <div className="text-red-500">{error.storage.type}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <select
                  name="capacity"
                  value={formData.storage.capacity}
                  onChange={(e) => handleNestedInputChange(e, "storage")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Capacity</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
                {/* {error.storage?.capacity ? (
                  <div className="text-red-500">{error.storage.capacity}</div>
                ) : null} */}
              </div>
            </div>
          </div>

          {/* Graphics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Graphics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.graphics.model}
                  onChange={(e) => handleNestedInputChange(e, "graphics")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., RTX 3060"
                />
                {/* {error.graphics?.model ? (
                  <div className="text-red-500">{error.graphics.model}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VRAM
                </label>
                <input
                  type="text"
                  name="vram"
                  value={formData.graphics.vram}
                  onChange={(e) => handleNestedInputChange(e, "graphics")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 6GB"
                />
                {/* {error.graphics?.vram ? (
                  <div className="text-red-500">{error.graphics.vram}</div>
                ) : null} */}
              </div>
            </div>
          </div>

          {/* Display */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Display</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.display.size}
                  onChange={(e) => handleNestedInputChange(e, "display")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 15.6 inch"
                />
                {/* {error.display?.size ? (
                  <div className="text-red-500">{error.display.size}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Resolution
                </label>
                <input
                  type="text"
                  name="resolution"
                  value={formData.display.resolution}
                  onChange={(e) => handleNestedInputChange(e, "display")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 1920x1080"
                />
                {/* {error.display?.resolution ? (
                  <div className="text-red-500">
                    {error.display.resolution}
                  </div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Refresh Rate
                </label>
                <input
                  type="text"
                  name="refreshRate"
                  value={formData.display.refreshRate}
                  onChange={(e) => handleNestedInputChange(e, "display")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 60Hz"
                />
                {/* {error.display?.refreshRate ? (
                  <div className="text-red-500">
                    {error.display.refreshRate}
                  </div>
                ) : null} */}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Operating System
                </label>
                <input
                  type="text"
                  name="operatingSystem"
                  value={formData.operatingSystem}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Windows 11"
                />
                {/* {error.operatingSystem ? (
                  <div className="text-red-500">{error.operatingSystem}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Battery Life
                </label>
                <input
                  type="text"
                  name="batteryLife"
                  value={formData.batteryLife}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 8 hours"
                />
                {/* {error.batteryLife ? (
                  <div className="text-red-500">{error.batteryLife}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 1.8 kg"
                />
                {/* {error.weight ? (
                  <div className="text-red-500">{error.weight}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ports
                </label>
                <input
                  type="text"
                  name="ports"
                  value={formData.ports}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 2xUSB, HDMI"
                />
                {/* {error.ports ? (
                  <div className="text-red-500">{error.ports}</div>
                ) : null} */}
              </div>
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pricing and Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Regular Price
                </label>
                <input
                  type="number"
                  name="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  // required
                />
                {/* {error.regularPrice ? (
                  <div className="text-red-500">{error.regularPrice}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Offer Percentage
                </label>
                <input
                  type="number"
                  name="offer"
                  value={formData.offer}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {/* {error.offer ? (
                  <div className="text-red-500">{error.offer}</div>
                ) : null} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  // required
                />
                {/* {error.quantity ? (
                  <div className="text-red-500">{error.quantity}</div>
                ) : null} */}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            {/* {error.description ? (
              <div className="text-red-500">{error.description}</div>
            ) : null} */}
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Medium"
              />
              {/* {error.size ? (
                <div className="text-red-500">{error.size}</div>
              ) : null} */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Silver"
              />
              {/* {error.color ? (
                <div className="text-red-500">{error.color}</div>
              ) : null} */}
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-indigo-500 transition-colors"
                >
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, index)}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label={`Upload image ${index + 1}`}
                  />
                  <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 rounded-lg overflow-hidden">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-sm mt-2">Add image</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {/* {error && (
            <div className="text-red-600 text-sm mt-2">
              {error}
            </div>
          )} */}

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              onClick={goback}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
