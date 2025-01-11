import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, X, Save } from "lucide-react";
import { toast, Toaster } from "sonner";
import { axiosInstance } from "../../../api/axiosConfig"; // Importing axiosInstance
import { categoryService } from '../../../apiServices/adminApiServices';
const EditCategoryPage = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        //const response = await axiosInstance.get(`/admin/get_category/${id}`);
        const response = await categoryService.getCategoryById(id);
        if (response.status === 200) {
          const { name, description } = response.data.data;
          setFormData({ name, description });
        } else {
          toast.error("Failed to fetch category details", {
            description: "Please try again or contact support.",
            duration: 4000,
          });
        }
      } catch (error) {
        toast.error("Network Error", {
          description:
            error.response?.data?.message || "Unable to fetch data. Please try again later.",
          duration: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name.trim() && !formData.description.trim()){
      toast.error("Validation Error", {
        description: "Please fill in all fields",
        duration: 3000,
      });
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Validation Error", {
        description: "Category name is required",
        duration: 3000,
      });
      return;
    }
    if(!formData.description.trim()) {
      toast.error("Validation Error", {
        description: "Category description is required",
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      // const response = await axiosInstance.patch(
      //   `/admin/update_category/${id}`,
      //   formData
      // );
      const response = await categoryService.updateCategory(id, formData);

      if (response.status === 200) {
        toast.success("Category Updated", {
          description: "Category has been successfully updated.",
          duration: 3000,
          onAutoClose: () => navigate("/admin/category"),
        });
      } else {
        toast.error("Update Failed", {
          description:
            response.data.message || "Unable to update category. Please try again.",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to update category. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {/* <Toaster position="top-right" /> */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        <div className="bg-blue-600 text-white p-6 flex items-center">
          <Edit className="mr-3 w-8 h-8" />
          <h2 className="text-2xl font-bold">Edit Category</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="Enter category name"
                // required
              />
              {formData.name && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, name: "" }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 resize-none"
              placeholder="Enter category description (optional)"
            />
          </div>

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
                  <Save className="mr-2 w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;
