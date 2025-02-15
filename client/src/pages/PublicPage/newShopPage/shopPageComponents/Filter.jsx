


"use client"

import React, { useState, useEffect, useCallback } from "react"
import PriceSelector from "./PriceSelector"
import CategorySelector from "./CategorySelector"
import SortingProducts from "./SortingProducts"
import { axiosInstance } from "../../../../api/axiosConfig"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"

const FilterComponent = ({ onFilterChange }) => {
  const [availableOptions, setAvailableOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedFields, setSelectedFields] = useState([])
  const [orderChange, setOrderChange] = useState("New Arrivals")
  const [priceChange, setPriceChange] = useState([0, 300000])
  const [selectedCategories, setSelectedCategories] = useState([])

  const [refreshOption, setRefreshOption] = useState(false);
  const fetchList = useCallback(async () => {
    setLoading(true)
    const response = await axiosInstance.post("/public/get_available_filters")
    setAvailableOptions(response.data.fieldData)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredFields = selectedFields.filter((field) => field[2].length > 0)
      const query = {
        orderChange,
        priceChange,
        selectedCategories,
        selectedFields: filteredFields,
      }
      onFilterChange(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [orderChange, priceChange, selectedCategories, selectedFields, onFilterChange, refreshOption])

  const handleMakeOptionsToDefault = () => {
    setSelectedFields([]); 
    setOrderChange("New Arrivals");
    setPriceChange([0, 300000]);
    setSelectedCategories([]);
    setRefreshOption(!refreshOption); 
  };

  const handleSelectChange = useCallback((displayName, fieldPath, selectedValues) => {
    setSelectedFields((prev) => {
      const existingFieldIndex = prev.findIndex((field) => field[1] === fieldPath)
      if (selectedValues.length === 0) {
        return prev.filter((field) => field[1] !== fieldPath)
      }
      const newField = [displayName, fieldPath, selectedValues]
      if (existingFieldIndex === -1) {
        return [...prev, newField]
      } else {
        const newFields = [...prev]
        newFields[existingFieldIndex] = newField
        return newFields
      }
    })
  }, [])

  return (
    <div className="p-6 w-[250px] max-w-md mx-auto bg-white shadow-lg rounded-xl">
      {loading ? (
        <div className="text-center">
          <p className="text-lg font-medium text-blue-600">Loading, please wait...</p>
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mt-6"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-blue-700">Filter Options</h1>
          <p className="text-gray-600">Select suitable options.</p>
          <div className="w-full rounded-md bg-blue-600 text-center text-white py-2 hover:cursor-pointer" onClick={handleMakeOptionsToDefault}>Clear All</div>
          <div className="space-y-4 ">
            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Order</h2>
              <SortingProducts onSortChange={setOrderChange} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Select Price</h2>
              <PriceSelector onPriceChange={setPriceChange} refreshOption={refreshOption}/>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Category</h2>
              <CategorySelector onCategoryChange={setSelectedCategories} refreshOption={refreshOption} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Field Selector</h2>
            <div className="space-y-3">
              {availableOptions.map((option) => (
                <SingleOptionBox key={option[1]} data={option} onSelect={handleSelectChange} refreshOption={refreshOption}/>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SingleOptionBox = React.memo(({ data, onSelect, refreshOption }) => {
  const [selectedValues, setSelectedValues] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setSelectedValues([])
  }, [refreshOption])

  const handleChange = (event) => {
    const { value, checked } = event.target
    const updatedValues = checked ? [...selectedValues, value] : selectedValues.filter((val) => val !== value)
    setSelectedValues(updatedValues)
    onSelect(data[0], data[1], updatedValues)
  }

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-blue-50 p-3 hover:bg-blue-100 transition-colors duration-200"
      >
        <span className="font-medium text-blue-700">{data[0]}</span>
        {isOpen ? <FiChevronUp className="text-blue-500" /> : <FiChevronDown className="text-blue-500" />}
      </button>
      {isOpen && (
        <div className="bg-white p-3 max-h-48 overflow-y-auto">
          {data[2].map((optionValue) => (
            <label
              key={optionValue}
              className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-blue-50 rounded px-2"
            >
              <input
                type="checkbox"
                value={optionValue}
                checked={selectedValues.includes(optionValue)}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{optionValue}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
})

export default FilterComponent

