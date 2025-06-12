import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import axiostoastrerror from '../utils/axiostoasterror';
import { Link, useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
  const [data, setData] = useState({
    email: '',
  })

  const navigate = useNavigate()

  const validateValues = Object.values(data).every(el => el)

  const [isLoading, setIsLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true); // start loader

    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message); // show error like "Invalid credentials"
      }

      if (response.data.success) {
        toast.success("Login successful!");
        setShowSuccess(true); // show success message

        navigate('/verify-otp',{
          state: data
         }) // pass email to the next page  
              }
            setData({
              email: ''
            }) // clear the input fields
    } catch (error) {
      axiostoastrerror(error);
    } finally {
      setIsLoading(false); // stop loader
    }
  };

  return (
    <section className='w-full container mx-auto px-2 mt-10'>
      <div className='bg-white shadow-xl w-full max-w-lg mx-auto rounded-3xl p-6 border border-gray-200'>
        <h2 className='text-2xl font-bold text-center text-slate-800 mb-1'>
            Forgot Password ?
        </h2>
        <p className='text-center text-gray-600 mb-4 text-sm'>
        Let's help you get back into your account.
        </p>

        <form className='grid gap-3 mt-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor="email" className='text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type="email"
              id='email'
              name='email'
              placeholder='Enter your email'
              className='w-full border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              disabled={isLoading} // Disable input when loading
            />
          </div>

          <button
            disabled={!validateValues || isLoading}
            className={`${(!validateValues || isLoading) ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-800'}
              text-slate-100 font-semibold rounded-xl px-4 py-2 mt-4 shadow-md transition transform hover:shadow-lg hover:shadow-green-500/50 hover:scale- duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              "Get OTP"
            )}
          </button>
        </form>

        {isLoading && !showSuccess &&(
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 animate-pulse">Sending OTP to your email...</p>
          </div>
        )}

        <div className="text-center mt-4 text-sm text-gray-700">
         Already have an account ?{" "}
          <a href="/login" className="text-green-800 font-bold hover:underline transition-all duration-200">
            Log in
          </a>
        </div>
      </div>
    </section>
  )
};

export default ForgotPassword
