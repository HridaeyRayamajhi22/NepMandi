






import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/axiostoasterror';
import toast from 'react-hot-toast';
import { setUserDetails, updateAvatar } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  useEffect(() => {

    // Check if the avatar URL is in localStorage and update Redux state
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar && storedAvatar !== user.avatar) {
      dispatch(updateAvatar(storedAvatar)); // Update Redux with the stored avatar
    }

    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission and page reload
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUser,
        data: userData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);  // Show success message

        // Immediately update Redux with the new user data
        dispatch(setUserDetails({
          ...user,
          ...userData, // Overwrite with updated fields
        }));

        // Optionally, perform a silent refresh of the user data after some time
        setTimeout(async () => {
          const newUserData = await fetchUserDetails();  // Fetch the latest data
          dispatch(setUserDetails(newUserData.data));  // Update Redux state with the latest data
        }, 1000);  // Delay the refresh to prevent race conditions
      }
    } catch (error) {
      AxiosToastError(error);  // Show error message if request fails
    } finally {
      setLoading(false);
    }
  };


  const handleCloseModal = () => setOpenProfileAvatarEdit(false);



  return (
    <div className='flex flex-col items-center justify-center gap-4'>

      {/* Profile Upload and Display image */}
      <div className='relative'>
        <div className='w-32 h-32 rounded-full flex items-center justify-center drop-shadow-sm bg-white border-2 overflow-hidden'>
          {user.avatar ? (
            <img
              alt={user.name}
              src={user.avatar}
              className='w-full h-full object-cover'
              onError={(e) => e.target.src = '/path/to/default-avatar.png'}
            />
          ) : (
            <FaRegCircleUser size={100} className='text-slate-800' />
          )}
        </div>

        <button
          onClick={() => setOpenProfileAvatarEdit(true)}
          className='absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs p-1 rounded-full border-2 border-white'
          aria-label="Change Profile Avatar"
        >
          ✎
        </button>
      </div>


      {openProfileAvatarEdit && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-4 rounded shadow-lg'>
            <UserProfileAvatarEdit onAvatarChangeSuccess={handleCloseModal} />
            <button onClick={handleCloseModal} className='mt-2 text-red-500'>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Name, Email, Mobile Form */}
      <form className='my-4 w-full max-w-xs space-y-4' onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <label htmlFor="name" className='text-xs mb-1 text-gray-600'>Name</label>
          <input
            type="text"
            id='name'
            placeholder='Enter your Name'
            className='px-3 py-1.5 bg-blue-50 text-sm border hover:border-green-500 rounded-md outline-none focus:border-blue-400 w-full'
            value={userData.name}
            name='name'
            onChange={handleOnChange}
            required
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor="email" className='text-xs mb-1 text-gray-600'>Email</label>
          <input
            type="email"
            id='email'
            placeholder='Enter your Email'
            className='px-3 py-1.5 bg-blue-50 text-sm border hover:border-green-500 rounded-md outline-none focus:border-blue-400 w-full'
            value={userData.email}
            name='email'
            onChange={handleOnChange}
            required
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor="mobile" className='text-xs mb-1 text-gray-600'>Mobile Number</label>
          <input
            type="text"
            id='mobile'
            placeholder='Enter your Phone Number'
            className='px-3 py-1.5 bg-blue-50 text-sm border hover:border-green-500 rounded-md outline-none focus:border-blue-400 w-full'
            value={userData.mobile}
            name='mobile'
            onChange={handleOnChange}
            required
          />
        </div>

        <button
          type='submit'
          className='mt-7 w-full bg-green-800 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-md transition duration-200 ease-in-out'
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Profile;  