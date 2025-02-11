import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import MyPageRecipeCreateModal from './MyPageRecipeCreateModal'

const MyPageRecipeForm = () => {
  const [showModal, setShowModal] = useState()

  const [recipeCategory, setRecipeCategory] = useState([])

  // 레시피 카테고리 불러오기
  const getRecipeCategory = () => {
    API.get('/recipecategory')
      .then((res) => {
        setRecipeCategory(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 레시피 작성하기
  const submitRecipe = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    // mount
    getRecipeCategory()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='w-[500px]'>
      <form className='flex flex-col gap-3' onSubmit={submitRecipe}>
        <div className='flex gap-2'>
          {/* 카테고리 */}
          <select
            defaultValue='0'
            className='flex-none w-[150px] h-[50px] border border-gray-300 rounded px-2'
          >
            <option value='0' disabled hidden>
              카테고리
            </option>
            {recipeCategory.map((v) => (
              <option value={v.categoryNo} key={v.categoryNo}>
                {v.name}
              </option>
            ))}
          </select>
          {/* 제목 */}
          <input
            type='text'
            className='grow h-[50px] border border-gray-300 rounded px-2'
            placeholder='제목을 적어주세요.'
          />
        </div>
        {/* 이미지 첨부 */}
        <div>
          <input type='file' name='' id='' />
        </div>
        {/* 상품 선택 */}
        <div>
          <button className='hover:text-indigo-600' onClick={() => setShowModal(true)}>
            상품 선택하기
          </button>
        </div>
        <textarea
          className='w-full min-h-[450px] border border-gray-300 rounded overflow-y-auto p-3 resize-none'
          placeholder='레시피 내용을 작성해주세요.'
        ></textarea>
        <button className='w-full h-[50px] bg-indigo-400 hover:bg-indigo-600 rounded text-white'>
          작성하기
        </button>
      </form>
      {showModal && <MyPageRecipeCreateModal setShowModal={setShowModal} />}
    </div>
  )
}

export default MyPageRecipeForm
