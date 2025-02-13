import React from 'react'

const RecipeDetailModal = ({ setShowModal, materials }) => {
  return (
    <div className='fixed top-0 left-0 z-50'>
      <div className='w-full h-full fixed bg-gray-600/80 flex justify-center items-center'>
        <div className='w-[600px] border border-gray-400 rounded bg-white p-5 flex flex-col'>
          {/* 모달 main */}

          <div className='flex-none flex justify-center mt-2'>
            <button className='text-red-600' onClick={() => setShowModal(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailModal
