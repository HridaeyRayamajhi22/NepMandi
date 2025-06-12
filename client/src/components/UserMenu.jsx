import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import axiostoastrerror from '../utils/axiostoasterror'
import { RiExternalLinkFill } from "react-icons/ri";
import itsAdmin from '../utils/itsAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ... keep existing handleLogout and handleClose functions ...

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      if (response.data.success) {
        if(close){
          close()
        }
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/Login")
        
      }
    } catch (error) {
      axiostoastrerror(error)
    }
  }

  const adminLinks = [
    { path: "/dashboard/category", label: "Category" },
    { path: "/dashboard/subcategory", label: "Sub Category" },
    { path: "/dashboard/upload-product", label: "Upload Product" },
    { path: "/dashboard/product", label: "Products" },
    { path: "/dashboard/admin/orders", label: "All Orders" },
    { path: "/dashboard/admin/analytics", label: "Analytics" },
  ];

  const commonUserLinks = [
     { path: "/dashboard/wishlist", label: "Wishlist" },
    { path: "/dashboard/myorders", label: "My Orders" },
    { path: "/dashboard/order-tracking", label: "Order Tracking" },
  ];

  // Choose the appropriate links based on user role
  const menuLinks = itsAdmin(user.role) ? adminLinks : commonUserLinks;

  const handleClose = () => {
    if (close) {
      close()
    }
  }

  return (
    <div className="p-4 min-w-[250px] text-center">
      {/* Account Header Section */}
      <div className='px-4 py-3 mb-4 bg-gray-50 rounded-lg'>
        <div className='flex justify-center items-center gap-3 mb-2'>
          <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
            <span>My Account</span>
            <div className='w-3 h-3 rounded-full bg-green-500 animate-pulse'></div>
          </h2>
        </div>

        {/* User Info - Centered */}
        <div className='flex flex-col items-center gap-1'>
          <p className='text-base font-medium text-gray-700'>
            {user.name || user.mobile}
            <span className='text-sm text-red-500 p-1 '>{user.role === "admin" ? "(admin)" : ""}</span>
          </p>

          <Link
            onClick={handleClose}
            to="/dashboard/profile"
            className="flex justify-center items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <span>View Profile</span>
            <RiExternalLinkFill className="mt-0.5" size={16} />
          </Link>
        </div>
      </div>

      <Divider className="my-3" />

      {/* Menu Links Section */}
      <div className='space-y-2'>
        {menuLinks.map((item) => (
          <Link
            key={item.path}
            onClick={handleClose}
            to={item.path}
            className='block w-full px-3 py-2 text-sm hover:bg-green-200 hover:text-base rounded-md transition-colors text-center'
          >
            {item.label}
          </Link>
        ))}

        {/* Centered Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className='px-3 py-2 text-sm hover:bg-red-200 hover:text-red-600 rounded-md transition-colors text-center w-full'
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenu