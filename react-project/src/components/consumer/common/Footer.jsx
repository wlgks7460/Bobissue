import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='w-full h-60 bg-slate-200 mt-10 px-20 py-5'>
      <div className='flex'>
        {/* 고객센터 */}
        <div className='w-[350px]'>
          <h3 className='text-lg mb-3'>고객센터</h3>
          <div className='flex gap-3 mb-3'>
            <Link
              to={'/board/faq'}
              className='py-1 px-2 border-b-2 border-white hover:text-indigo-600'
            >
              FAQ
            </Link>
            <Link
              to={'/board/notice'}
              className='py-1 px-2 border-b-2 border-white hover:text-indigo-600'
            >
              공지사항
            </Link>
            <Link
              to={'board/question'}
              className='py-1 px-2 border-b-2 border-white hover:text-indigo-600'
            >
              문의하기
            </Link>
          </div>
          <div className='mb-3'>
            <span className='text-2xl me-3'>0000-0000</span>
            <span className='text-gray-600'>월~토요일 오전9시-오후6시</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
