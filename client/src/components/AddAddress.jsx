import React from 'react'
import { useForm } from 'react-hook-form'
import Axios from '../utils/axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/axiostoasterror'
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset } = useForm()
  const { fetchAddress } = useGlobalContext()

  const onSubmit = async (data) => {
    console.log('data', data)

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (close) {
          close()
          reset()
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto">
      <div className="bg-white p-6 w-full max-w-lg mt-16 mx-auto rounded-xl shadow-lg">
        <div className="flex justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add Address</h2>
          <button onClick={close} className="hover:text-red-500">
            <IoClose size={25} />
          </button>
        </div>

        <form className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <label htmlFor="addressline" className="font-medium text-gray-700">Address Line:</label>
            <input
              type="text"
              id="addressline"
              className="border border-gray-00 bg-blue-50 p-3 rounded-lg"
              {...register('addressline', { required: true })}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="city" className="font-medium text-gray-700">City:</label>
            <input
              type="text"
              id="city"
              className="border border-gray-300 bg-blue-50 p-3 rounded-lg"
              {...register('city', { required: true })}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="state" className="font-medium text-gray-700">State:</label>
            <input
              type="text"
              id="state"
              className="border border-gray-300 bg-blue-50 p-3 rounded-lg"
              {...register('state', { required: true })}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="pincode" className="font-medium text-gray-700">Pincode:</label>
            <input
              type="text"
              id="pincode"
              className="border border-gray-300 bg-blue-50 p-3 rounded-lg"
              {...register('pincode', { required: true })}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="country" className="font-medium text-gray-700">Country:</label>
            <input
              type="text"
              id="country"
              className="border border-gray-300 bg-blue-50 p-3 rounded-lg"
              {...register('country', { required: true })}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="mobile" className="font-medium text-gray-700">Mobile No.:</label>
            <input
              type="text"
              id="mobile"
              className="border border-gray-300 bg-blue-50 p-3 rounded-lg"
              {...register('mobile', { required: true })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold mt-4 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}

export default AddAddress
