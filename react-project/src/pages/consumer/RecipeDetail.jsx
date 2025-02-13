import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SearchBar from '../../components/consumer/common/SearchBar'
import API from '../../utils/API'
import recipeDefaultImg from '../../assets/consumer/recipeDefault.webp'
import RecipeDetailItemList from '../../components/consumer/recipe/RecipeDetailItemList'
import RecipeDetailModal from '../../components/consumer/recipe/RecipeDetailModal'

const RecipeDetail = () => {
  const params = useParams()

  const [showModal, setShowModal] = useState(false)

  const [recipeData, setRecipeData] = useState({})
  const [selectedImg, setSelectedImg] = useState({})

  // 레시피 상세 데이터 조회
  const getRecipeData = () => {
    API.get(`/recipe/${params.recipeNo}`)
      .then((res) => {
        setRecipeData(res.data.result.data)
        setSelectedImg(res.data.result.data.images[0])
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    // mount
    getRecipeData()
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>{recipeData.name}</h2>
          {/* 이미지 */}
          <div className='flex justify-center'>
            <div className='flex flex-col gap-3 items-center'>
              <div>
                <img
                  src={selectedImg?.imageUrl || recipeDefaultImg}
                  alt={selectedImg?.originalName}
                  className='w-[50rem] max-h-[500px] rounded'
                  onError={(e) => {
                    e.target.src = recipeDefaultImg
                    e.target.alt = '레시피 기본 이미지'
                  }}
                />
              </div>
              <div className='w-[50rem] h-[130px] flex gap-5 overflow-x-auto'>
                {recipeData.images?.map((v) => (
                  <div key={v.imageNo} className='cursor-pointer' onClick={() => setSelectedImg(v)}>
                    <img
                      src={v.imageUrl}
                      alt=''
                      className={`w-[150px] h-[100px] rounded ${selectedImg.imageNo === v.imageNo ? 'border-2 border-indigo-600' : 'border border-gray-400'}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className='border border-gray-400 my-10' />
          {/* 재료 상품 */}
          <RecipeDetailItemList materials={recipeData.materials} setShowModal={setShowModal} />
          <hr className='border border-gray-400 my-10' />
          {/* 레시피 상세 */}
          <div className='px-20'>
            <div className='text-lg'>
              <span className='text-gray-600'>조리 시간 : </span>
              <span className='text-xl font-bold'>{recipeData.time}</span>
              <span>분</span>
            </div>
            <div className='px-10 py-5'>
              {recipeData.description?.split('\n').map((v, i) => (
                <p key={`description-${i + 1}`} className='text-xl my-5'>
                  {v}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <RecipeDetailModal setShowModal={setShowModal} materials={recipeData.materials} />
      )}
    </div>
  )
}

export default RecipeDetail
