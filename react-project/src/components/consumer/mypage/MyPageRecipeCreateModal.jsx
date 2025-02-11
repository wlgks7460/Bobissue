import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import API from '../../../utils/API'

const MyPageRecipeCreateModal = ({ setShowModal }) => {
  const categories = useSelector((state) => state.category.categories)

  const [children, setChildren] = useState(categories[0].children)

  const getCategoryItem = (categoryNo) => {
    API.get(`/categories/${categoryNo}`)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    // mount
    getCategoryItem(categories[0].categoryNo)
    // unmount
    return () => {}
  }, [])
  return (
    <div className='fixed top-0 left-0 z-50'>
      <div className='w-full h-full fixed bg-gray-600/80 flex justify-center items-center'>
        <div className='w-[600px] border border-gray-400 rounded bg-white p-5 flex flex-col'>
          <h3 className='text-lg text-center'>상품 선택하기</h3>
          {/* 모달 main */}
          <div className='w-full my-5 px-3'>
            {/* 상품 카테고리 */}
            <div className='flex border border-gray-300 rounded'>
              {/* 상위 카테고리 */}
              <div className='flex-none w-[150px] h-[100px] overflow-y-auto flex flex-col gap-2 p-2 border-e border-gray-300'>
                {categories.map((v, i) => (
                  <button
                    className='text-left'
                    key={v.categoryNo}
                    onClick={() => setChildren(categories[i].children)}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
              {/* 하위 카테고리 */}
              <div className='grow w-[150px] grid grid-cols-3'>
                <button>전체보기</button>
                {children.map((v) => (
                  <button key={v.categoryNo}>{v.name}</button>
                ))}
              </div>
            </div>
          </div>
          {/* 모달 닫기 버튼 */}
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

export default MyPageRecipeCreateModal
