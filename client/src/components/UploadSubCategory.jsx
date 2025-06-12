import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImage from '../utils/UploadImage';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/axiostoasterror';
import { setAllCategory, setLoadingCategory } from '../store/productSlice'; // Correct path for your Redux slice

const UploadSubCategory = ({ close, fetchData }) => {
  const dispatch = useDispatch();
  const [subCategoryData, setSubCategoryData] = useState({
    name: '',
    image: '',
    category: [],
  });

  // Getting all categories from the Redux store
  const allCategory = useSelector((state) => state.product.allCategory);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);

  // Function to handle category selection
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Uploading image
  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;

    setSubCategoryData((prev) => ({
      ...prev,
      image: ImageResponse.data.url,
    }));
  };

  // Remove selected category
  const handleRemoveCategorySelected = (categoryId) => {
    const index = subCategoryData.category.findIndex((el) => el._id === categoryId);
    subCategoryData.category.splice(index, 1);
    setSubCategoryData((prev) => ({
      ...prev,
    }));
  };

  // Handle form submission
  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
        }
        if (fetchData) {
          fetchData();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };


  // Show loading if categories are being fetched
  if (loadingCategory) {
    return (
      <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 rounded">
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
 
    <section className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
  <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b">
      <h1 className="text-lg font-semibold text-gray-800 ">Add Sub Category</h1>
      <button onClick={close} className="text-gray-600 hover:text-red-500 transition">
        <IoClose size={24} />
      </button>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmitSubCategory} className="space-y-5 p-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
        <input
          id="name"
          name="name"
          value={subCategoryData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-200 focus:border-primary-200 outline-none"
          placeholder="Enter name"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-36 h-36 border border-gray-300 bg-gray-50 rounded-md flex items-center justify-center">
            {subCategoryData.image ? (
              <img src={subCategoryData.image} alt="sub-category" className="w-full h-full object-contain rounded-md" />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
          <label htmlFor="uploadImage" className="cursor-pointer">
            <div className="bg-primary-100 text-primary-600  hover:bg-blue-900 hover:text-teal-200 px-4 py-2 rounded-md border border-green-500 transition">
              Upload Image
            </div>
            <input
              type="file"
              id="uploadImage"
              className="hidden"
              onChange={handleUploadSubCategoryImage}
            />
          </label>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
        <div className="border border-gray-300 rounded-md p-2 space-y-2">
          {/* Selected Categories */}
          <div className="flex flex-wrap gap-2">
            {subCategoryData.category.map((cat) => (
              <span
                key={cat._id + 'selected'}
                className="flex items-center gap-2 bg-gray-100 text-sm px-2 py-1 rounded shadow-sm"
              >
                {cat.name}
                <IoClose
                  size={18}
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => handleRemoveCategorySelected(cat._id)}
                />
              </span>
            ))}
          </div>

          {/* Select Input */}
          <select
            onChange={(e) => {
              const value = e.target.value;
              const categoryDetails = allCategory.find((el) => el._id === value);
              if (categoryDetails && !subCategoryData.category.find(cat => cat._id === value)) {
                setSubCategoryData((prev) => ({
                  ...prev,
                  category: [...prev.category, categoryDetails],
                }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none bg-white text-sm"
          >
            <option value="">Select Category</option>
            {allCategory?.length > 0 ? (
              allCategory.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-3 text-center">
        <button
          type="submit"
          disabled={
            !subCategoryData.name ||
            !subCategoryData.image ||
            subCategoryData.category.length === 0
          }
          className={`px-5 py-2 rounded-md font-semibold transition ${
            subCategoryData.name &&
            subCategoryData.image &&
            subCategoryData.category.length
              ? 'bg-primary-600 text-yellow border border-green-600 hover:bg-blue-900 hover:text-teal-200'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</section>

    );
  };
  
  export default UploadSubCategory;