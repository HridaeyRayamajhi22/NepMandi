import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/axiostoasterror';
import successAlert from '../utils/SuccessAlert';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    moreInfo: {},
  })

  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const allCategory = useSelector(state => state.product.allCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageLoading(true)

    try {
      const response = await uploadImage(file)
      const imageUrl = response?.data?.data?.url
      if (imageUrl) {
        setData((prev) => ({
          ...prev,
          image: [...prev.image, imageUrl]
        }))
      }
    } catch (error) {
      AxiosToastError(error)
    }

    setImageLoading(false)
  }

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.image]
    updatedImages.splice(index, 1)
    setData(prev => ({
      ...prev,
      image: updatedImages
    }))
  }

  const handleRemoveCategory = (index) => {
    const updatedCategories = [...data.category]
    updatedCategories.splice(index, 1)
    setData(prev => ({
      ...prev,
      category: updatedCategories
    }))
  }

  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = [...data.subCategory]
    updatedSubCategories.splice(index, 1)
    setData(prev => ({
      ...prev,
      subCategory: updatedSubCategories
    }))
  }

  const handleAddField = () => {
    if (!fieldName.trim()) return
    setData(prev => ({
      ...prev,
      moreInfo: {
        ...prev.moreInfo,
        [fieldName]: ""
      }
    }))
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      })

      if (response?.data?.success) {
        successAlert(response.data.message)
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          moreInfo: {},
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='max-w-6xl mx-auto p-8'>
      <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white'>
          <h2 className='text-2xl font-bold'>Upload New Product</h2>
          <p className='text-sm text-blue-200'>Please fill in all the required fields to add a product</p>
        </div>

        {/* Form */}
        <form className='p-8 grid gap-8' onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className='space-y-6'>
            <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>Basic Information</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Product Name*</label>
                <input
                  name='name'
                  type='text'
                  value={data.name}
                  onChange={handleChange}
                  placeholder='e.g. Himalayan Honey'
                  required
                  className='w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Unit*</label>
                <input
                  name='unit'
                  type='text'
                  value={data.unit}
                  onChange={handleChange}
                  placeholder='e.g. kg, liters'
                  required
                  className='w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Description*</label>
              <textarea
                name='description'
                value={data.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder='Write a brief product description...'
                className='w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>Product Images</h3>
            <label
              htmlFor='productImage'
              className={`flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-md cursor-pointer 
                ${imageLoading ? 'bg-gray-100 border-gray-300' : 'hover:border-blue-500 bg-blue-50 border-blue-400'}`}
            >
              {imageLoading ? (
                <Loading />
              ) : (
                <div className='text-center'>
                  <FaCloudUploadAlt className='text-blue-600 text-3xl mx-auto' />
                  <p className='text-sm mt-2'>Click to upload or drag image here</p>
                  <p className='text-xs text-gray-500'>JPG, PNG, max 5MB</p>
                </div>
              )}
              <input
                id='productImage'
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleUploadImage}
              />
            </label>
            {data.image.length > 0 && (
              <div className='flex flex-wrap gap-3'>
                {data.image.map((img, index) => (
                  <div key={index} className='relative group'>
                    <img
                      src={img}
                      alt={`Uploaded ${index}`}
                      onClick={() => setViewImageURL(img)}
                      className='w-24 h-24 object-cover rounded-md border cursor-pointer hover:opacity-80'
                    />
                    <button
                      type='button'
                      onClick={() => handleDeleteImage(index)}
                      className='absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition'
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Category Selector */}
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>Category</h3>
              <select
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find(el => el._id === value);
                  if (category && !data.category.find(cat => cat._id === category._id)) {
                    setData(prev => ({
                      ...prev,
                      category: [...prev.category, category]
                    }));
                  }
                  setSelectCategory("");
                }}
                className='w-full p-3 border rounded-md shadow-sm'
              >
                <option value=''>Select Category</option>
                {allCategory.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <div className='flex flex-wrap mt-2 gap-2'>
                {data.category.map((cat, idx) => (
                  <span key={idx} className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1'>
                    {cat.name}
                    <button onClick={() => handleRemoveCategory(idx)} className='hover:text-red-500'>
                      <IoClose size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SubCategory Selector */}
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>Subcategory</h3>
              <select
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(el => el._id === value);
                  if (subCategory && !data.subCategory.find(cat => cat._id === subCategory._id)) {
                    setData(prev => ({
                      ...prev,
                      subCategory: [...prev.subCategory, subCategory]
                    }));
                  }
                  setSelectSubCategory("");
                }}
                className='w-full p-3 border rounded-md shadow-sm'
              >
                <option value=''>Select Sub Category</option>
                {allSubCategory.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <div className='flex flex-wrap mt-2 gap-2'>
                {data.subCategory.map((cat, idx) => (
                  <span key={idx} className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1'>
                    {cat.name}
                    <button onClick={() => handleRemoveSubCategory(idx)} className='hover:text-red-500'>
                      <IoClose size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className='space-y-6'>
            <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>Pricing & Inventory</h3>
            <div className='grid md:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Price (रु)*</label>
                <input
                  type='number'
                  name='price'
                  value={data.price}
                  onChange={handleChange}
                  required
                  placeholder='e.g. 1500'
                  className='w-full p-3 border rounded-md shadow-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Discount (%)</label>
                <input
                  type='number'
                  name='discount'
                  value={data.discount}
                  onChange={handleChange}
                  placeholder='e.g. 10'
                  className='w-full p-3 border rounded-md shadow-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Stock*</label>
                <input
                  type='number'
                  name='stock'
                  value={data.stock}
                  onChange={handleChange}
                  required
                  placeholder='e.g. 100'
                  className='w-full p-3 border rounded-md shadow-sm'
                />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center border-b pb-2'>
              <h3 className='text-xl font-semibold text-gray-800'>Additional Info</h3>
              <button
                type='button'
                onClick={() => setOpenAddField(true)}
                className='bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm'
              >
                + Add Field
              </button>
            </div>
            {Object.keys(data.moreInfo).length > 0 ? (
              <div className='grid md:grid-cols-2 gap-6'>
                {Object.entries(data.moreInfo).map(([key, value], idx) => (
                  <div key={idx}>
                    <label className='block text-sm font-medium text-gray-700 mb-1 capitalize'>{key}</label>
                    <input
                      type='text'
                      value={value}
                      onChange={(e) =>
                        setData(prev => ({
                          ...prev,
                          moreInfo: {
                            ...prev.moreInfo,
                            [key]: e.target.value
                          }
                        }))
                      }
                      className='w-full p-3 border rounded-md shadow-sm'
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-md'>No custom fields added.</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              className='w-full bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800 text-lg font-semibold shadow'
            >
              Save Product
            </button>
          </div>
        </form>
      </div>

      {/* Modals */}
      {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  )
}

export default UploadProduct
