import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/axiostoasterror';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
  const [data, setData] = useState({
    _id: CategoryData._id,
    name: CategoryData.name,
    image: CategoryData.image,
  });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.updateCategory, data });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchData();
        close();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      setData((prev) => ({ ...prev, image: ImageResponse.data.url }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Update Category</h2>
          <button onClick={close} className="text-gray-600 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              placeholder="Enter category name"
              className="border rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">Category Image</p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Preview */}
              <div className="w-32 h-32 bg-gray-100 border flex items-center justify-center rounded-md overflow-hidden">
                {data.image ? (
                  <img src={data.image} alt="Category" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              {/* Upload Button */}
              <label htmlFor="uploadImage" className="w-full sm:w-auto">
                <div
                  className={`px-4 py-2 rounded-md cursor-pointer text-center ${
                    data.name ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Uploading...' : 'Upload Image'}
                </div>
                <input
                  id="uploadImage"
                  type="file"
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!data.name || !data.image || loading}
            className={`w-full py-2 rounded-md font-semibold mt-2 ${
              data.name && data.image && !loading
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {loading ? 'Updating...' : 'Update Category'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
