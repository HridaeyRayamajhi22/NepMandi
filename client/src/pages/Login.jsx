import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import axiostoastrerror from '../utils/axiostoasterror';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateValues = Object.values(data).every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateValues) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.success) {
        toast.success("Login successful!");

        const { AccessToken, RefreshToken, user } = response.data.data;

        localStorage.setItem('AccessToken', AccessToken);
        localStorage.setItem('RefreshToken', RefreshToken);

        dispatch(setUserDetails(user)); // ✅ Set fresh user data to Redux

        setShowSuccess(true);
        navigate('/');
      }
    } catch (error) {
      axiostoastrerror(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='w-full container mx-auto px-2 mt-10'>
      <div className='bg-white shadow-xl w-full max-w-lg mx-auto rounded-3xl p-6 border border-gray-200'>
        <h2 className='text-2xl font-bold text-center text-slate-800 mb-1'>
          Sign in to your NepMandi account
        </h2>
        <p className='text-center text-gray-600 mb-4 text-sm'>
          Please enter your details to login.
        </p>

        <form className='grid gap-3 mt-4' onSubmit={handleSubmit}>
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
              disabled={isLoading}
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
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-green-700 hover:underline font-medium transition-all duration-200"
              >
                Forgot Password?
              </Link>
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
                <span>Loading...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {isLoading && !showSuccess && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 animate-pulse">Logging you in...</p>
          </div>
        )}

        <div className="text-center mt-4 text-sm text-gray-700">
          New to our Mandi?{" "}
          <Link to="/register" className="text-green-800 font-bold hover:underline transition-all duration-200">
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
