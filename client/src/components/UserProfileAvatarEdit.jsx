import React, { useState } from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { IoIosCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import AxiosToastError from '../utils/axiostoasterror';
import { updateAvatar } from '../store/userSlice';

const UserProfileAvatarEdit = ({ onAvatarChangeSuccess }) => {
  const user = useSelector(state => state.user); // Fetch current user from Redux
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Handle avatar upload
const handleUploadAvatarImage = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  const accessToken = localStorage.getItem('AccessToken');

  try {
    setLoading(true);

    const response = await Axios.put('https://nepmandi.onrender.com/api/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // handle success...
  } catch (error) {
    AxiosToastError(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-50">
    <div className="bg-white rounded-2xl shadow-xl w-96 p-6 flex flex-col items-center relative transform transition-transform duration-300 scale-95 hover:scale-100">
      {/* Close Button */}
      <div className="absolute top-4 right-4 group">
        <button 
          onClick={onAvatarChangeSuccess} 
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <IoIosCloseCircle size={28} className="group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Avatar Display */}
      {/* Avatar Display */}
<div className="group relative mb-6">
  <div className="w-60 h-60 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-white shadow-lg hover:ring-2 ring-blue-500 transition-all duration-300 overflow-hidden rounded-xl">
    {user.avatar ? (
      <img
        src={user.avatar}
        alt={user.name}
        className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
      />
    ) : (
      <FaRegCircleUser size={160} className="text-gray-800" />
    )}
  </div>
  
  {/* Hover layer */}
  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300">
    <span className="text-white text-sm font-medium">Change Photo</span>
  </div>
</div>


      {/* Upload Button */}
      <label 
        htmlFor="uploadProfile" 
        className={`w-full text-center px-6 py-3 text-lg font-medium transition-all duration-300
          ${loading 
            ? 'bg-blue-400 cursor-wait' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-blue-200/50'
          } 
          rounded-full text-white relative overflow-hidden`}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          </div>
        ) : (
          <span className="relative z-10">Choose New Avatar</span>
        )}
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></div>
      </label>

      {/* File Input (Hidden) */}
      <input
        onChange={handleUploadAvatarImage}
        type="file"
        id="uploadProfile"
        className="hidden"
        accept="image/*"
      />

      <p className="mt-4 text-sm text-gray-500 text-center">
        Change your profile picture to make your account more personalized.
          <br/>
      
      </p>
    </div>
  </section>
  );
};

export default UserProfileAvatarEdit;
