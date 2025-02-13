import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import RecipeDetailItem from './RecipeDetailItem'

const RecipeDetailItemList = ({ materials, setShowModal }) => {
  return (
    <div className='px-20'>
      <h3 className='text-xl mb-5'>재료</h3>
      {materials?.length > 0 ? (
        <div className='flex gap-3 px-5 py-3 overflow-y-auto'>
          {materials.map((v) => (
            <RecipeDetailItem key={v.itemNo} itemNo={v.itemNo} cnt={v.cnt} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col gap-3 items-center'>
          <p className='text-center'>
            <ExclamationCircleIcon className='w-20 text-gray-400' />
          </p>
          <p className='text-center text-xl text-gray-600'>등록된 재료가 없습니다.</p>
        </div>
      )}
      {materials?.length > 0 && (
        <div className='mt-2'>
          <button
            className='w-full h-[50px] bg-indigo-400 hover:bg-indigo-600 rounded text-white'
            onClick={(e) => setShowModal(true)}
          >
            재료 장바구니 담기
          </button>
        </div>
      )}
    </div>
  )
}

export default RecipeDetailItemList
