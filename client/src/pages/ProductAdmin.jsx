
import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/axiostoasterror'
import Axios from '../utils/axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5"

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductData()
    }, 400)
    return () => clearTimeout(delayDebounce)
  }, [search])

  const handleNext = () => {
    if (page < totalPageCount) setPage(prev => prev + 1)
  }

  const handlePrevious = () => {
    if (page > 1) setPage(prev => prev - 1)
  }

  return (
    <section className="min-h-screen">
      <div className="py-1 pr-7 bg-slate-100 shadow-md flex items-center justify-between">
        <h2 className="font-semibold pl-3">Products</h2>

        <div className="ml-auto  bg-white px-1 py-2 rounded-md flex items-center border border-gray-300 focus-within:border-green-500">
          <IoSearchOutline size={20} className="text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search product..."
            className="outline-none bg-transparent w-full text-sm"
          />
        </div>
      </div>

      {loading && <Loading />}

      <div className="p-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
        {
          productData.map((product, index) => (
            <ProductCardAdmin
              key={product._id || index}
              data={product}
              fetchProductData={fetchProductData}
            />
          ))
        }
      </div>

<div className="fixed bottom-3 z-10 left-0 right-0 md:left-72 md:right-4 lg:left-[300px] lg:right-[30px] shadow-lg bg-white rounded-md">
  <div className="flex justify-between items-center py-3 px-5 shadow-inner rounded-md relative">
    <button
      onClick={handlePrevious}
      className="px-4 py-1 border border-gray-300 hover:bg-[#cffed6] rounded-md text-sm"
    >
      Previous
    </button>

    <span className="text-sm font-medium mx-4 absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
      Page {page} of {totalPageCount}
    </span>

    <button
      onClick={handleNext}
      className="px-4 py-1 border border-gray-300 hover:bg-blue-100 rounded-md text-sm lg:ml-auto lg:mr-10"
    >
      Next
    </button>
  </div>
</div>



    </section>
  )
}

export default ProductAdmin
