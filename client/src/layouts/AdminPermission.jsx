import React from 'react'
import itsAdmin from '../utils/itsAdmin'
import { useSelector } from 'react-redux'

const AdminPermission = ({children}) => {
    const user = useSelector(state => state.user)
  return (
    <>
     {
        itsAdmin(user.role) ? children: <p className='text-red-600 bg-slate-100 p-3'>Do not have permission</p>
     }
     </>
  )
}

export default AdminPermission
