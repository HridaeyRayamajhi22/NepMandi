import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Axios from '../utils/axios';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateValues = Object.values(data).every(el => el);

  useEffect(() => {
    if (!(location?.state?.data?.success)) {
      navigate('/');
    }

    if (location?.state?.email) {
      setData(prev => ({
        ...prev,
        email: location.state.email
      }));
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if(data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      });

      if (response.data.error) {
        console.error(response.data.message);
      }

      if (response.data.success) {
        toast.success("Password updated successfully!");
        setShowSuccess(true);
        navigate('/login', { state: data });
        setData({ email: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
        AxiosToastError(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full container mx-auto px-2 mt-10">
      <div className="bg-white shadow-xl w-full max-w-lg mx-auto rounded-3xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">
          Update Your Password
        </h2>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Make sure to use a strong password for security.
        </p>

        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="grid gap-1">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                placeholder="Enter your new password"
                className="w-full border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={data.newPassword}
                onChange={(e) => setData({ ...data, newPassword: e.target.value })}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Re-enter your new password"
                className="w-full border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
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
                <span>Updating...</span>
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        {isLoading && !showSuccess && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 animate-pulse">Updating password...</p>
          </div>
        )}

        <div className="text-center mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-800 font-bold hover:underline transition-all duration-200"
          >
            Log in
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
