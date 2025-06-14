import React, { useState } from 'react'
import Logo from '../assets/Logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from 'react-redux';
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import download from '../assets/download.jpg'

const Header = () => {
  const [isMobile] = useMobile(768);
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate('/login');
  }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  }

  const handleMobileUser = () => {
    if (!user._id) {
      navigate('/login');
      return;
    }
    navigate("/user");
  }

  return (
    <header className='h-24 lg:h-20 lg:shadow-md shadow-sm sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
      {!(isSearchPage && isMobile) && (
        <div className='container mx-auto flex items-center px-10 justify-between'>
          {/* Logo */}
          <div className='h-full'>
            <Link to={"/"} className='h-full flex justify-center items-center'>
              <div className="hidden lg:flex items-center space-x-2">
                <img
                  src={download}
                  width={160}
                  height={50}
                  alt="NepMandi Logo"
                  className="rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
                />
              </div>
              <img
                src={Logo}
                width={190}
                height={20}
                alt="Logo"
                className='lg:hidden'
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className='hidden lg:block'>
            <Search />
          </div>

          {/* Mobile: Navigation Links Login and Carts */}
          <div>
            <button className='text-neutral-800 lg:hidden' onClick={handleMobileUser}>
              <FaUserCircle size={28} />
            </button>

            {/* Desktop: Navigation Links Login and Carts */}
            <div className='hidden lg:flex items-center gap-10'>
              {user?._id ? (
                <div className='relative'>
                  <div 
                    onClick={() => setOpenUserMenu(prev => !prev)} 
                    className='flex items-center gap-2 cursor-pointer group'
                  >
                    <div className='flex items-center gap-2'>
                      <div className='w-9 h-9 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden border border-blue-200'>
                        {user?.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <span className='text-blue-600 font-medium text-lg'>
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        )}
                      </div>
                      <div className='text-left'>
                        <p className='text-sm font-medium text-gray-700'>
                          {user?.name?.split(' ')[0] || 'Account'}
                        </p>
                        <p className='text-xs text-gray-500'>My Account</p>
                      </div>
                    </div>
                    {openUserMenu ? (
                      <VscTriangleUp size={16} className='text-gray-400' />
                    ) : (
                      <VscTriangleDown size={16} className='text-gray-400' />
                    )}
                  </div>

                  {openUserMenu && (
                    <div className='absolute right-0 top-12 animate-fade-in'>
                      <div className='bg-white rounded-lg p-2 min-w-48 shadow-xl border border-gray-100'>
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={redirectToLoginPage} 
                  className='text-lg px-2 font-medium hover:font-bold'
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setOpenCartSection(true)}
                className='flex items-center gap-4 bg-sky-950 px-4 py-3 rounded-md text-white hover:bg-sky-700 transition duration-300 ease-in-out'>
                <div className='animate-bounce'>
                  <TiShoppingCart size={37} />
                </div>
                <div className='font-semibold'>
                  {
                    cartItem[0] ? (
                      <div>
                        <p>{totalQty} Items</p>
                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                      </div>
                    ) : (
                      <p>My Cart</p>
                    )
                  }
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto px-10 lg:hidden'>
        <Search />
      </div>
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  )
}

export default Header;