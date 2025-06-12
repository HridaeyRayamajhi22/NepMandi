import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCartShopping } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'

const CartMobileLink = () => {
  const { totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)

  return (
    <>
      {
        cartItem[0] && (
          <div className='sticky bottom-4 p-4'>
            <div className='bg-gradient-to-r from-green-500 to-green-700 px-4 py-3 rounded-xl text-white flex items-center justify-between gap-3 lg:hidden shadow-lg'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-green-600 rounded-full'>
                  <FaCartShopping size={20} />
                </div>
                <div className='text-sm'>
                  <p className='font-semibold'>{totalQty} items</p>
                  <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              </div>

              <Link to="/cart" className='flex items-center gap-2 text-sm font-semibold text-neutral-100 hover:text-white'>
                <span>View Cart</span>
                <FaCaretRight size={14} />
              </Link>
            </div>
          </div>
        )
      }
    </>
  )
}

export default CartMobileLink
