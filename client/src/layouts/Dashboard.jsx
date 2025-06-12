import React, { use } from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {

  const user = useSelector((state) => state.user)
  return (

    <section className='bg-slate-100'>

      <div className='container mx-auto p-3 grid lg:grid-cols-[253px,1fr]'>
        {/* Left Menu Section */}
        <div className='py-4 sticky top-24 max-h-[calc(100vh-122 px)] overflow-auto hidden lg:block border-r'>
          <UserMenu />
        </div>


        {/* Right Menu Section */}
        <div className="min-h-[75vh] p-4">
          <h1 className='text-2xl font-bold mb-4'>
             <Outlet />
          </h1>
         
        </div>

      </div>
    </section>
  )
}

export default Dashboard
