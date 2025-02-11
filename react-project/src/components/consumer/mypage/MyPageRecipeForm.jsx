import React from 'react'

const MyPageRecipeForm = () => {
  return (
    <div className='w-[500px]'>
      <form className='flex flex-col gap-3'>
        <div className='flex gap-2'>
          {/* 카테고리 */}
          <select
            defaultValue='0'
            className='flex-none w-[150px] h-[50px] border border-gray-300 rounded px-2'
          >
            <option value='0' disabled hidden>
              카테고리
            </option>
            <option value='1'>카테고리1</option>
            <option value='2'>카테고리2</option>
            <option value='3'>카테고리3</option>
            <option value='4'>카테고리4</option>
            <option value='5'>카테고리5</option>
          </select>
          {/* 제목 */}
          <input type='text' className='grow h-[50px] border border-gray-300 rounded' />
        </div>
        {/* 이미지 첨부 */}
        <div>
          <input type='file' name='' id='' />
        </div>
        <textarea className='w-full min-h-[450px] border border-gray-300 rounded overflow-y-auto p-3 resize-none'></textarea>
        <button className='w-full h-[50px] bg-indigo-400 hover:bg-indigo-600 rounded text-white'>
          작성하기
        </button>
      </form>
    </div>
  )
}

export default MyPageRecipeForm
