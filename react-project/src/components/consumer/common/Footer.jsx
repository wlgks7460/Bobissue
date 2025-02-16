import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='w-full h-60 bg-slate-200 mt-10 px-20 py-5 border-t border-[#6F4E37]'>
      <div className='flex'>
        {/* 고객센터 */}
        <div className='w-[350px]'>
          <h3 className='text-lg mb-3'>고객센터</h3>
          <div className='flex gap-3 mb-3'>
            <Link
              to={'/board/faq'}
              className='py-1 px-2 border-b-2 border-white hover:text-[#6F4E37]'
            >
              FAQ
            </Link>
            <Link
              to={'/board/notice'}
              className='py-1 px-2 border-b-2 border-white hover:text-[#6F4E37]'
            >
              공지사항
            </Link>
            <Link
              to={'board/question'}
              className='py-1 px-2 border-b-2 border-white hover:text-[#6F4E37]'
            >
              문의하기
            </Link>
          </div>
          <div className='mb-3'>
            <p className='text-2xl me-3'>0000-0000</p>
            <p className='text-gray-600'>월~토요일 오전9시-오후6시</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
