import React from 'react'

const AdminNav = () => {
  return (
    <nav className='fixed top-0 left-64 w-[calc(100%-16rem)] bg-white shadow-md z-50'>
      <div className='px-6 py-3 flex justify-between items-center'>
        <h1 className='text-xl font-semibold text-gray-800'>관리자 페이지</h1>
        <div>
          <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AdminNav
