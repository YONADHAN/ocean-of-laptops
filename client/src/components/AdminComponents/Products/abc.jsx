import {React, useState} from 'react'

const abc = () => {

    const [formData, setFormData] = useState(initialFormState);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([null, null, null, null]);
    const [cropState, setCropState] = useState({
        open: false,
        imageSrc: "",
        index: null,
        croppedAreaPixels: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1,
    });


    useEffect(() => {
      const fetchCategories = async () => {       
        try {         
          const response = await axiosInstance.get("http://localhost:3000/admin/get_category_list");
          if (response.data.success) {
            setCategories(response.data.categories);
          }
        } catch (error) {         
          toast.error("Failed to fetch categories");
        }
      };
      fetchCategories();
    }, []);


    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleNestedInputChange = (e, parent) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: value,
        },
      }));
    };
  


    const handleImageChange = (e, index) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setCropState((prev) => ({
            ...prev,
            open: true,
            imageSrc: reader.result,
            index,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
      setCropState((prev) => ({
        ...prev,
        croppedAreaPixels,
      }));
    };

    
    
  const handleSaveCroppedImage = async () => {
    try {
      if (!cropState.croppedAreaPixels) {
        toast.error("No crop data available");
        return;
      }

      const croppedImage = await getCroppedImage(
        cropState.imageSrc,
        cropState.croppedAreaPixels
      );

      const croppedFile = new File(
        [croppedImage],
        `cropped-image-${Date.now()}.jpeg`,
        { type: "image/jpeg" }
      );

      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[cropState.index] = croppedFile;
        return newImages;
      });

      toast.success("Image cropped successfully");

      setCropState({
        open: false,
        imageSrc: "",
        index: null,
        croppedAreaPixels: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1,
      });
    } catch (error) {
      toast.error("Failed to process image");
    }
  };

  const uploadImagesToCloudinary = async () => {
    const uploadPromises = images.filter(Boolean).map(async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "LAPTOPHUB");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dndvg7z6d/image/upload",
          formData
        );
        return response.data.secure_url;
      } catch (error) {
        console.error("Failed to upload image:", error);
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter(Boolean);
  };
  
    

  const initialFormState = {
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
    salePrice: "",
    quantity: "",
    description: "",
    category: "",
    size: "",
    color: "",
    status: "Available",
    isBlocked: false,
    popularity: 0,
    rating: 0,
    productImage: [],
  };

  
  const ValidateTheInputs = (formData) => {
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
    if (formData.category.trim() === "") {
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
      errors.display = { ...errors.display, resolution: "Resolution is required" };
      isValid = false;
    }
    if (formData.display.refreshRate.trim() === "") {
      errors.display = { ...errors.display, refreshRate: "Refresh Rate is required" };
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
    if (formData.weight.trim() === "") {
      errors.weight = "Weight is required";
      isValid = false;
    }
    if (formData.ports.trim() === "") {
      errors.ports = "Ports are required";
      isValid = false;
    }
    if (formData.regularPrice.trim() === "") {
      errors.regularPrice = "Regular Price is required";
      isValid = false;
    }
    if (formData.quantity.trim() === "") {
      errors.quantity = "Quantity is required";
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (images.filter(Boolean).length < 4) {
        // toast.error("Please add at least one product image");
        return;
      }

      const uploadedImageUrls = await uploadImagesToCloudinary();

      if (uploadedImageUrls.length === 0) {
        toast.error("Failed to upload images");
        return;
      }

      const updatedFormData = {
        ...formData,
        productImage: uploadedImageUrls,
      };
      console.log("updated data is :  ---> ",updatedFormData);//=========================================================================
      let valid = ValidateTheInputs(updatedFormData);
      if (!valid) {
        return;
      }

      if(updatedFormData.salePrice < 0 || updatedFormData.regularPrice < 0 || updatedFormData.quantity < 0){
        toast.error("Price and Quantity cannot be negative");
        return ;
      }

      const response = await axiosInstance.post("/admin/add_product", {
        productSubmissionData: updatedFormData,
      });

      if (response.data.success) {
        toast.success("Product added successfully");
        navigate("/admin/products");
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while adding the product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div>
      
    </div>
  )
}

export default abc
