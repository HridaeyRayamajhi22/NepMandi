
import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa"
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/emptycart1.png'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout")
      close?.()
    } else {
      toast("Please login")
    }
  }

  return (
    <section className="bg-neutral-900 fixed inset-0 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-sm h-full ml-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 shadow-md border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={close} className="text-gray-700 hover:text-red-500 transition-all">
            <IoClose size={25} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-blue-50 p-3">
          {
            cartItem?.length > 0 ? (
              <>
                {/* Savings Summary */}
                <div className="flex justify-between items-center px-4 py-2 mb-3 rounded-full bg-blue-100 text-blue-500 font-medium text-sm">
                  <p>Your total savings</p>
                  <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                </div>

                {/* Cart Items */}
                <div className="bg-white rounded-md p-3 space-y-4 shadow-sm">
                  {cartItem.map(item => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-16 h-16 rounded border overflow-hidden bg-gray-100">
                        <img
                          src={item?.productId?.image[0]}
                          alt="Product"
                          className="w-full h-full object-scale-down"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-800 line-clamp-2">{item?.productId?.name}</p>
                        <p className="text-gray-500">{item?.productId?.unit}</p>
                        <p className="font-semibold text-green-700">{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                      </div>
                      <AddToCartButton data={item?.productId} />
                    </div>
                  ))}
                </div>

                {/* Bill Details */}
                <div className="bg-white mt-4 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold mb-2 text-gray-800">Bill Details</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Items total</span>
                    <span className="flex items-center gap-2">
                      <span className="line-through text-gray-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                      <span className="text-green-700">{DisplayPriceInRupees(totalPrice)}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quantity total</span>
                    <span>{totalQty} items</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Delivery Charge</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-base mt-3 border-t pt-2">
                    <span>Grand Total</span>
                    <span>{DisplayPriceInRupees(totalPrice)}</span>
                  </div>
                </div>
              </>
            ) : (
              // Empty Cart
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <img src={imageEmpty} alt="Empty cart" className="max-w-xs mx-auto object-contain" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <Link
                  to="/"
                  onClick={close}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-all"
                >
                  Shop Now
                </Link>
              </div>
            )
          }
        </div>

        {/* Footer / Checkout */}
        {
          cartItem?.length > 0 && (
            <div className="p-3 border-t bg-white shadow-md">
              <div className="flex items-center justify-between bg-green-700 text-white font-semibold px-4 py-3 rounded-md">
                <span>{DisplayPriceInRupees(totalPrice)}</span>
                <button
                  onClick={redirectToCheckoutPage}
                  className="flex items-center gap-1 hover:underline"
                >
                  Proceed
                  <FaCaretRight />
                </button>
              </div>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default DisplayCartItem
