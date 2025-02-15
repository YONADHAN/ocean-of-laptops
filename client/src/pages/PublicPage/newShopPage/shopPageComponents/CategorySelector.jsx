

// import React, { useEffect, useState } from 'react';
// import {axiosInstance} from '../../../../api/axiosConfig';
// import { toast } from 'react-toastify';

// const SelectingCategories = ({onCategoryChange, refreshOption}) => {
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);

//     const fetchCategoryList = async () => {
//         try {
//             const response = await axiosInstance.get('/get_category_list');
//             if (!response.data || !response.data.categories) {
//                 toast.error("No category list fetched");
//                 return;
//             }
//             // console.log("Fetched Categories:", response.data.categories);
//             setCategories(response.data.categories);
//         } catch (error) {
//             toast.error("An error occurred while fetching category list");
//         }
//     };

//     useEffect(() => {
//         fetchCategoryList();
//     }, []);

//     const handleSelectingCategories = (categoryId) => {
//         setSelectedCategories((prev) =>
//         {
//             const updatedCategories = prev.includes(categoryId)
//                 ? prev.filter((id) => id !== categoryId) // Remove if already selected
//                 : [...prev, categoryId] // Add if not selected

//             onCategoryChange(updatedCategories);
//             return updatedCategories;
//         }
//         );
//     };

//     return (
//         <>
//             <div className="font-semibold">Category Selector</div>
//             <div>
//                 {categories.map((category) => (
//                     <div key={category._id}>
//                         <input
//                             type="checkbox"
//                             id={`category-${category._id}`}
//                             value={category._id}
//                             onChange={() => handleSelectingCategories(category._id)}
//                             checked={selectedCategories.includes(category._id)}
//                         />
//                         <label htmlFor={`category-${category._id}`}>{category.name}</label>
//                     </div>
//                 ))}
//             </div>
            
//         </>
//     );
// };

// export default SelectingCategories;



import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../api/axiosConfig';
import { toast } from 'react-toastify';

const SelectingCategories = ({ onCategoryChange, refreshOption }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const response = await axiosInstance.get('/get_category_list');
                if (!response.data || !response.data.categories) {
                    toast.error("No category list fetched");
                    return;
                }
                setCategories(response.data.categories);
            } catch (error) {
                toast.error("An error occurred while fetching category list");
            }
        };

        fetchCategoryList();
    }, []); // Fetch categories once when the component mounts

    // Reset selected categories when refreshOption changes
    useEffect(() => {
        setSelectedCategories([]); 
        onCategoryChange([]); // Notify parent that categories have been reset
    }, [refreshOption]); 

    const handleSelectingCategories = (categoryId) => {
        setSelectedCategories((prev) => {
            const updatedCategories = prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Remove if already selected
                : [...prev, categoryId]; // Add if not selected

            onCategoryChange(updatedCategories);
            return updatedCategories;
        });
    };

    return (
        <div>
            <div className="font-semibold">Category Selector</div>
            <div>
                {categories.map((category) => (
                    <div key={category._id}>
                        <input
                            type="checkbox"
                            id={`category-${category._id}`}
                            value={category._id}
                            onChange={() => handleSelectingCategories(category._id)}
                            checked={selectedCategories.includes(category._id)}
                        />
                        <label htmlFor={`category-${category._id}`}>{category.name}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelectingCategories;
