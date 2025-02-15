










// import React, { useState, useCallback, useMemo } from 'react';
// import Filter from './shopPageComponents/Filter';
// import { axiosInstance } from '../../../api/axiosConfig';
// import FilteredProducts from '../newShopPage/pages/FilteredProducts';
// import Pagination from '../../../components/MainComponents/Pagination';

// const NewShopPage = () => {
//     const [productsData, setProductData] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [currentFilter, setCurrentFilter] = useState({});
    
//     const limit = useMemo(() => 12, []);

//     const debounce = (func, wait) => {
//         let timeout;
//         return (...args) => {
//             clearTimeout(timeout);
//             timeout = setTimeout(() => func(...args), wait);
//         };
//     };

//     const fetchProducts = useCallback(async (filterQuery, page) => {
//         try {
//             setLoading(true);
//             const queryData = {
//                 finalQuery: { ...filterQuery, searchTerm },
//                 currentPage: page,
//                 limit
//             };
//             console.log("Fetching products with query:", JSON.stringify(queryData, null, 2));
//             const response = await axiosInstance.post('/public/filter_apply_and_get_data', queryData);

//             if (response.data.success) {
//                 setProductData(response.data.products);
//                 setTotalPages(Math.ceil(response.data.totalCount / limit));
//                 setCurrentPage(page);
//             }
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [searchTerm, limit]);

//     const handleSearch = useCallback(
//         debounce((value) => {
//             setSearchTerm(value);
//             fetchProducts(currentFilter, 1);
//         }, 500),
//         [currentFilter, fetchProducts]
//     );

//     const handleFinalQuery = useCallback((filterQuery) => {
//         setCurrentFilter(filterQuery);
//         fetchProducts(filterQuery, 1);
//     }, [fetchProducts]);

//     const handlePageChange = useCallback((page) => {
//         fetchProducts(currentFilter, page);
//     }, [currentFilter, fetchProducts]);

//     const handleSearchInput = (event) => {
//         handleSearch(event.target.value);
//     };

//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex gap-6 mt-6">
//                 {/* Filter Section */}
//                 <div className=" p-1 bg-white shadow-lg rounded-lg h-fit ">
//                     <Filter onFilterChange={handleFinalQuery} />
//                 </div>

//                 {/* Products Section */}
//                 <div className="w-3/4">
//                     <div className="mb-4">
//                         <input
//                             type="text"
//                             placeholder="Search products..."
//                             onChange={handleSearchInput}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {loading ? (
//                         <div className="flex justify-center items-center min-h-[200px]">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                         </div>
//                     ) : (
//                         <FilteredProducts products={productsData} />
//                     )}

//                     {totalPages > 1 && (
//                         <div className="mt-4">
//                             <Pagination
//                                 currentPage={currentPage}
//                                 totalPages={totalPages}
//                                 onPageChange={handlePageChange}
//                             />
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default React.memo(NewShopPage);



// import React, { useState, useCallback, useMemo } from 'react';
// import Filter from './shopPageComponents/Filter';
// import { axiosInstance } from '../../../api/axiosConfig';
// import FilteredProducts from '../newShopPage/pages/FilteredProducts';
// import Pagination from '../../../components/MainComponents/Pagination';
// import { Filter as FilterIcon } from 'lucide-react';

// const NewShopPage = () => {
//     const [productsData, setProductData] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [currentFilter, setCurrentFilter] = useState({});
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
    
//     const limit = useMemo(() => 12, []);

//     const debounce = (func, wait) => {
//         let timeout;
//         return (...args) => {
//             clearTimeout(timeout);
//             timeout = setTimeout(() => func(...args), wait);
//         };
//     };

//     const fetchProducts = useCallback(async (filterQuery, page) => {
//         try {
//             setLoading(true);
//             const queryData = {
//                 finalQuery: { ...filterQuery, searchTerm },
//                 currentPage: page,
//                 limit
//             };
//             console.log("Fetching products with query:", JSON.stringify(queryData, null, 2));
//             const response = await axiosInstance.post('/public/filter_apply_and_get_data', queryData);

//             if (response.data.success) {
//                 setProductData(response.data.products);
//                 setTotalPages(Math.ceil(response.data.totalCount / limit));
//                 setCurrentPage(page);
//             }
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [searchTerm, limit]);

//     const handleSearch = useCallback(
//         debounce((value) => {
//             setSearchTerm(value);
//             fetchProducts(currentFilter, 1);
//         }, 500),
//         [currentFilter, fetchProducts]
//     );

//     const handleFinalQuery = useCallback((filterQuery) => {
//         setCurrentFilter(filterQuery);
//         fetchProducts(filterQuery, 1);
//         setIsFilterOpen(false); // Close filter on mobile after applying
//     }, [fetchProducts]);

//     const handlePageChange = useCallback((page) => {
//         fetchProducts(currentFilter, page);
//     }, [currentFilter, fetchProducts]);

//     const handleSearchInput = (event) => {
//         handleSearch(event.target.value);
//     };

//     const toggleFilter = () => {
//         setIsFilterOpen(!isFilterOpen);
//     };

//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Mobile Filter Toggle */}
//             <div className="lg:hidden fixed bottom-4 right-4 z-50">
//                 <button 
//                     onClick={toggleFilter}
//                     className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
//                 >
//                     <FilterIcon size={24} />
//                 </button>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-6 mt-6">
//                 {/* Filter Section */}
//                 <div className={`
//                     fixed lg:relative inset-0 bg-white lg:bg-transparent z-40 
//                     transform transition-transform duration-300 ease-in-out
//                     ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//                     lg:w-1/4 lg:block lg:h-auto overflow-auto
//                     p-4 lg:p-1 lg:shadow-lg lg:rounded-lg
//                 `}>
//                     {/* Close button for mobile */}
//                     <button 
//                         className="lg:hidden absolute top-4 right-4 text-gray-500"
//                         onClick={toggleFilter}
//                     >
//                         ×
//                     </button>
//                     <Filter onFilterChange={handleFinalQuery} />
//                 </div>

//                 {/* Products Section */}
//                 <div className="lg:w-3/4 w-full">
//                     <div className="mb-4">
//                         <input
//                             type="text"
//                             placeholder="Search products..."
//                             onChange={handleSearchInput}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {loading ? (
//                         <div className="flex justify-center items-center min-h-[200px]">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                         </div>
//                     ) : (
//                         <FilteredProducts products={productsData} />
//                     )}

//                     {totalPages > 1 && (
//                         <div className="mt-4">
//                             <Pagination
//                                 currentPage={currentPage}
//                                 totalPages={totalPages}
//                                 onPageChange={handlePageChange}
//                             />
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default React.memo(NewShopPage);


"use client"

import React, { useState, useCallback, useMemo } from "react"
import { FilterIcon, PanelLeftCloseIcon as CloseIcon, SearchIcon } from "lucide-react"

import Filter from './shopPageComponents/Filter';
import { axiosInstance } from '../../../api/axiosConfig';
import FilteredProducts from '../newShopPage/pages/FilteredProducts';
import Pagination from '../../../components/MainComponents/Pagination';


const ResponsiveShopPage = () => {
  const [productsData, setProductData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [currentFilter, setCurrentFilter] = useState({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const limit = useMemo(() => 12, [])

  const debounce = (func, wait) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const fetchProducts = useCallback(
    async (filterQuery, page) => {
      try {
        setLoading(true)
        const queryData = {
          finalQuery: { ...filterQuery, searchTerm },
          currentPage: page,
          limit,
        }
        //console.log("Fetching products with query:", JSON.stringify(queryData, null, 2))
        const response = await axiosInstance.post("/public/filter_apply_and_get_data", queryData)

        if (response.data.success) {
          setProductData(response.data.products)
          setTotalPages(Math.ceil(response.data.totalCount / limit))
          setCurrentPage(page)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    },
    [searchTerm, limit],
  )

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value)
      fetchProducts(currentFilter, 1)
    }, 500),
    [fetchProducts], 
  )

  const handleFinalQuery = useCallback(
    (filterQuery) => {
      setCurrentFilter(filterQuery)
      fetchProducts(filterQuery, 1)
    //   setIsFilterOpen(false)
    },
    [fetchProducts],
  )

  const handlePageChange = useCallback(
    (page) => {
      fetchProducts(currentFilter, page)
    },
    [currentFilter, fetchProducts],
  )

  const handleSearchInput = (event) => {
    handleSearch(event.target.value)
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleFilter}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="Toggle filter"
        >
            {isFilterOpen?<CloseIcon/>:<FilterIcon size={24} />}
          
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Filter Section */}
        <div
          className={`
          fixed inset-0 bg-white z-40 mt-10 
          transform transition-transform duration-300 ease-in-out
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:w-1/4 lg:block lg:bg-transparent
          overflow-auto p-4 lg:p-0
        `}
        >
          {/* Close button for mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 text-gray-500"
            onClick={toggleFilter}
            aria-label="Close filter"
          >
            <CloseIcon size={24} />
          </button>
          <Filter onFilterChange={handleFinalQuery} />
        </div>

        {/* Products Section */}
        <div className="  lg:w-3/4 w-full">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search products..."
              onChange={handleSearchInput}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <FilteredProducts products={productsData} />
          )}

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(ResponsiveShopPage)

