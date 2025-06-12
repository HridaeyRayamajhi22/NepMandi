    

import React from 'react'
import UserMenu from '../components/UserMenu'
import { FaWindowClose } from "react-icons/fa";

const UserMenuMobile = () => {
  return ( 
    <>
      <div className="flex justify-end my-auto p-10">
        <button className="text-gray-500 hover:text-gray-800" onClick={() => window.history.back()}>
          <FaWindowClose size={24} />
        </button>
      </div>

      <section className="h-full w-full py-4 text-base">
        <div className="container mx-auto px-3 pb-10 ">
          <UserMenu />  
        </div>
      </section>
    </>
  )
}

export default UserMenuMobile
