import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Layers } from "lucide-react";
import { toast, Toaster } from "sonner";
import {axiosInstance} from "../../../api/axiosConfig"; 
import {categoryService} from "../../../apiServices/adminApiServices";
const AddCategoryPage = () => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!category.name.trim() && !category.description.trim()){
      toast.error("Validation Error", {
        description: "Category name and description are required",
        duration: 3000,
      });
      return;
    }

   
    if (!category.name.trim()) {
      toast.error("Validation Error", {
        description: "Category name is required",
        duration: 3000,
      });
      return;
    }
    if(!category.description.trim()) {
      toast.error("Validation Error", {
        description: "Description is required",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await categoryService.addCategory(category);

      if (response.status === 200 || response.status === 201) {
        toast.success("Category Added", {
          description: "New category has been successfully created.",
          duration: 3000,
          onAutoClose: () => navigate("/admin/category"),
        });
      } else {
        toast.error("Add Category Failed", {
          description:
           response.data.message ||
            "Unable to add category",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error("Network Error", {
        description: error.response?.data?.message || "Failed to add category. Please try again.",
        duration: 4000,
      });
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearField = (fieldName) => {
    setCategory((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center">
          <Layers className="mr-3 w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Add Category</h2>
            <p className="text-sm text-blue-100">
              Create a new category for your store
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          {/* Category Name Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={category.name}
                onChange={handleChange}
                placeholder="Enter category name"
                // required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              {category.name && (
                <button
                  type="button"
                  onClick={() => handleClearField("name")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={category.description}
                onChange={handleChange}
                placeholder="Enter category description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 resize-none"
              />
              {category.description && (
                <button
                  type="button"
                  onClick={() => handleClearField("description")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">

            <button
              type="button"
              onClick={() => navigate("/admin/category")}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-300 flex items-center"
            >
              <X className="mr-2 w-5 h-5" /> Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Plus className="mr-2 w-5 h-5" /> Add Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
