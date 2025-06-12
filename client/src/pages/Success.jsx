import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Success = () => {
  const location = useLocation()

  return (
    <div className="m-4 w-full max-w-md bg-green-50 p-6 py-7 rounded-xl shadow-xl mx-auto flex flex-col justify-center items-center gap-5">
      <p className="text-green-800 font-semibold text-xl text-center">
         {Boolean(location?.state?.text) ? `${location?.state?.text}ed` : 'Payment Completed'} Successfully!

      </p>
      
      <Link
        to="/"
        className="border border-green-800 text-green-800 hover:bg-green-800 hover:text-white transition-all duration-300 px-6 py-2 rounded-full text-lg font-medium flex items-center justify-center gap-2"
      >
        Go To Home
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12H9m3-3l3 3-3 3"
          />
        </svg>
      </Link>
    </div>
  )
}

export default Success
