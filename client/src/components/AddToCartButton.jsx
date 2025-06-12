import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/axiostoasterror'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from 'react-icons/fa6'

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const [isAvailableCart, setIsAvailableCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartItemDetails, setCartItemsDetails] = useState()

  const handleADDTocart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.addTocart,
        data: { productId: data?._id },
      })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchCartItem?.()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const found = cartItem.find(item => item.productId._id === data._id)
    setIsAvailableCart(Boolean(found))
    setQty(found?.quantity || 0)
    setCartItemsDetails(found)
  }, [cartItem, data])

  const increaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const response = await updateCartItem(cartItemDetails?._id, qty + 1)
    if (response.success) toast.success("Item added")
  }

  const decreaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id)
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1)
      if (response.success) toast.success("Item removed")
    }
  }

  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex items-center justify-between bg-white border gap-x-2 border-sky-200 px-2 py-1 rounded-xl shadow-sm">
          <button
            onClick={decreaseQty}
            className="w-7 h-7 flex items-center justify-center bg-sky-950 text-white hover:bg-sky-800 rounded-full transition-all"
            title="Remove one"
          >
            <FaMinus size={10} />
          </button>
          <span className="text-sky-950 font-bold text-sm">{qty}</span>
          <button
            onClick={increaseQty}
            className="w-7 h-7 flex items-center justify-center bg-sky-950 text-white hover:bg-sky-800 rounded-full transition-all"
            title="Add one"
          >
            <FaPlus size={10} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className="w-full bg-sky-950 hover:bg-sky-800 text-white font-medium text-sm py-2 px-4 rounded-xl transition-all shadow-sm"
        >
          {loading ? <Loading size="sm" /> : 'Add'}
        </button>
      )}
    </div>
  )
}

export default AddToCartButton
