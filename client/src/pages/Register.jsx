import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import axiostoastrerror from '../utils/axiostoasterror';
import { useNavigate } from 'react-router-dom';



const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const validateValues = Object.values(data).every(el => el)

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateValues) {
      toast.error("Please fill in all fields")
      return
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // if (!data || data.password.length < 6 || !/^[a-zA-Z0-9]+$/.test(data.password)) {
    //   toast.error("Password must be at least 6 characters long and alphanumeric");
    //   return;
    // }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true) // start loader

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data
      })
      if (response.data.error) {
        toast.error(response.data.message)
      }
      if (response.data.success) {
        toast.success(response.data.message)
        setShowSuccess(true)

        setTimeout(() => {
          navigate('/login');
        }, 1000); // 1 second delay
      }
    } catch (error) {
      axiostoastrerror(error)
    } finally {
      setIsLoading(false) // stop loader
    }
  }
  return (
    <section className='w-full container mx-auto px-2 mt-10'>
      <div className='bg-white shadow-xl w-full max-w-lg mx-auto rounded-3xl p-6 border border-gray-200'>
        <h2 className='text-2xl font-bold text-center text-slate-800 mb-1'>
          Welcome to NepMandi
        </h2>
        <p className='text-center text-gray-600 mb-4 text-sm'>
          Create your account below
        </p>

        <form className='grid gap-3 mt-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor="name" className='text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type="text"
              id='name'
              placeholder='Enter your name'
              className='w-full border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              disabled={isLoading} // Disable input when loading
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor="email" className='text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type="email"
              id='email'
              placeholder='Enter your email'
              className='w-full border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              disabled={isLoading} // Disable input when loading
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor="password" className='text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Enter your password'
                className='w-full border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                disabled={isLoading} // Disable input when loading
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          <div className='grid gap-1'>
            <label htmlFor="confirmPassword" className='text-sm font-medium text-gray-700'>
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                placeholder='Confirm password'
                className='w-full border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                disabled={isLoading} // Disable input when loading
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validateValues || isLoading}
            className={`${(!validateValues || isLoading) ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-800'}
              text-slate-100 font-semibold rounded-xl px-4 py-2 mt-4 shadow-md transition transform hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                </svg>
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {isLoading && !showSuccess && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 animate-pulse">Processing your registration...</p>
          </div>
        )}

        <div className="text-center mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="text-green-800 font-semibold hover:underline transition-all duration-200">
            Login
          </a>
        </div>
      </div>
    </section>
  )
};

export default Register;

