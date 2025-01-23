import React, { useEffect, useRef } from 'react'

const SignupTermsModal = ({ open, setOpen, title, content }) => {
  const contentRef = useRef()

  return (
    <div className='absolute top-0 left-0 z-10'>
      <div className='w-full h-full fixed bg-gray-600/80 flex justify-center items-center'>
        <div className='w-[400px] h-[550px] border border-gray-400 rounded bg-white p-5 flex flex-col'>
          <p className='text-xl font-semibold mb-3 flex-none'>{title}</p>
          {/* 약관 내용 */}
          <div className='overflow-y-auto grow'>{content}</div>
          <div className='flex-none flex justify-center'>
            <button className='text-indigo-600' onClick={() => setOpen(!open)}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupTermsModal
