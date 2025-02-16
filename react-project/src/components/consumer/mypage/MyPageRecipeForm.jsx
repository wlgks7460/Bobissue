import React, { useEffect, useRef, useState } from 'react'
import API from '../../../utils/API'
import MyPageRecipeCreateModal from './MyPageRecipeCreateModal'
import MyPageRecipeCreateModalSelectedItem from './MyPageRecipeCreateModalSelectedItem'
import { useNavigate } from 'react-router-dom'

const MyPageRecipeForm = () => {
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)

  const [recipeCategory, setRecipeCategory] = useState([])

  const [files, setFiles] = useState([])

  const [selectedItems, setSelectedItems] = useState([]) // 선택된 상품 정보

  const fileInputRef = useRef(null)

  const categoryRef = useRef()
  const nameRef = useRef()
  const timeRef = useRef()
  const contentRef = useRef()

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
  // 이미지 input 핸들러
  const handleFileInput = (e) => {
    e.preventDefault()
    fileInputRef.current.click()
  }

  // 파일 선택 시 파일 이름 업데이트
  const handleFileChange = (e) => {
    const tempFiles = e.target.files
    const fileArray = Array.from(tempFiles).map((file) => {
      return { id: `image-${file.name}`, name: file.name, file: file }
    })
    setFiles([...files, ...fileArray])
  }
  // 이미지 목록에서 제거
  const deleteFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx))
  }

  // 레시피 작성하기
  const submitRecipe = (e) => {
    e.preventDefault()
    const recipe = {
      categoryNo: Number(categoryRef.current.value),
      name: nameRef.current.value,
      time: Number(timeRef.current.value),
      description: contentRef.current.value,
      materials: selectedItems.map((v) => {
        return { itemNo: v.itemNo, cnt: v.count }
      }),
    }
    const formData = new FormData()
    formData.append('recipe', JSON.stringify(recipe))
    files.forEach((obj) => {
      formData.append('images', obj.file)
    })
    console.log(recipe)
    if (recipe.categoryNo === 0) {
      alert('카테고리를 선택해주세요.')
    } else if (!recipe.name) {
      alert('제목을 작성해주세요.')
    } else if (!recipe.time) {
      alert('시간을 설정해주세요.')
    } else if (!recipe.description) {
      alert('내용을 작성해주세요.')
    } else {
      API.post('/recipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          console.log(res)
          alert('작성되었습니다.')
          navigate('/mypage/recipe')
        })
        .catch((err) => {
          console.error(err)
        })
    }
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
            ref={categoryRef}
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
            ref={nameRef}
          />
        </div>
        {/* 이미지 첨부 */}
        <div>
          <input
            type='file'
            className='hidden'
            name='images'
            multiple
            accept='image/*'
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <button className='hover:text-[#6F4E37]' onClick={handleFileInput}>
            이미지 추가하기
          </button>
          {files.length > 0 ? (
            <div className='w-full h-[100px] mt-1 p-3 border border-gray-300 rounded overflow-y-auto flex flex-wrap gap-3'>
              {files.map((v, i) => (
                <div
                  key={v.id}
                  className='h-[35px] flex items-centr px-2 border border-[#6F4E37] rounded'
                >
                  <span className='flex items-center'>{v.name}</span>
                  <button
                    className='ms-3 text-gray-400'
                    onClick={(e) => {
                      e.preventDefault()
                      deleteFile(i)
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center'>이미지가 없습니다.</p>
          )}
        </div>
        {/* 상품 선택 */}
        <div>
          <button
            className='hover:text-[#6F4E37] mb-2'
            onClick={(e) => {
              e.preventDefault()
              setShowModal(true)
            }}
          >
            상품 선택하기
          </button>
          <div className='overflow-y-auto max-h-[200px]'>
            {selectedItems.length > 0 ? (
              <div>
                {selectedItems.map((v) => (
                  <MyPageRecipeCreateModalSelectedItem
                    key={v.itemNo}
                    item={v}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                ))}
              </div>
            ) : (
              <p className='text-center'>선택된 상품이 없습니다.</p>
            )}
          </div>
        </div>
        <div>
          <input
            type='number'
            className='w-[100px] h-[50px] border border-gray-300 rounded px-2'
            placeholder='요리 시간(분)'
            ref={timeRef}
          />
          <span className='ms-2'>분</span>
        </div>
        <textarea
          className='w-full min-h-[450px] border border-gray-300 rounded overflow-y-auto p-3 resize-none'
          placeholder='레시피 내용을 작성해주세요.'
          ref={contentRef}
        ></textarea>
        <button className='w-full h-[50px] bg-[#A67B5B] hover:bg-[#6F4E37] rounded text-white'>
          작성하기
        </button>
      </form>
      {showModal && (
        <MyPageRecipeCreateModal
          setShowModal={setShowModal}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )}
    </div>
  )
}

export default MyPageRecipeForm
