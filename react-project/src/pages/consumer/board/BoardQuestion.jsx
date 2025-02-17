import React, { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircleIcon as OutlineCheckCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid'

const BoardQuestion = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const orderNoParam = searchParams.get('order')
  const categoryParam = searchParams.get('category')
  const categories = [
    { id: 0, name: '상품' },
    { id: 1, name: '배송' },
    { id: 2, name: '환불' },
    { id: 3, name: '기타' },
  ]
  // 카테고리
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'none')
  // 첨부 이미지
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)
  const titleRef = useRef()
  const contentRef = useRef()
  // 비밀글 여부
  const [isPrivate, setIsPrivate] = useState(false)

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

  // 문의하기
  const createQuestion = () => {
    const payload = {
      category: selectedCategory,
      title: titleRef.current.value,
      content: contentRef.current.value,
      isPrivate: isPrivate,
    }

    const formData = new FormData()
    formData.append('question', JSON.stringify(payload))
    files.forEach((obj) => {
      formData.append('images', obj.file)
    })
    if (payload.category === 'none') {
      alert('문의 분류를 선택해주세요.')
    } else if (payload.title.trim() === '') {
      alert('제목을 작성해주세요.')
    } else if (payload.content.trim() === '') {
      alert('내용을 작성해주세요.')
    } else {
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`)
      })
    }
  }

  const submitQuestion = (e) => {
    e.preventDefault()
    createQuestion()
  }

  return (
    <div className='p-5 flex flex-col items-center'>
      <h2 className='text-2xl text-center mb-10'>문의하기</h2>
      <form className='w-[40rem]' onSubmit={submitQuestion}>
        {/* 주문 번호 */}
        {orderNoParam && (
          <div className='flex items-center gap-3 mb-3'>
            <span className='text-gray-400'>주문 번호</span>
            <span className='text-lg text-[#6F4E37]'>{orderNoParam}</span>
          </div>
        )}
        <div className='w-full flex gap-2 mb-5'>
          {/* 문의 카테고리 & 제목 */}
          <select
            className='flex-none w-[150px] h-[50px] border border-[#6F4E37] rounded px-2'
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value='none' hidden>
              문의 분류
            </option>
            {categories.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
          <input
            type='text'
            className='grow h-[50px] border border-[#6F4E37] rounded px-2'
            placeholder='제목을 작성해주세요.'
            ref={titleRef}
          />
        </div>
        {/* 이미지 첨부 */}
        <div className='w-full mb-5'>
          <input
            type='file'
            className='hidden'
            name='images'
            multiple
            accept='image/*'
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <button className='hover:text-[#6F4E37] px-2' onClick={handleFileInput}>
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
        {/* 내용 */}
        <div className='mb-5'>
          <textarea
            className='w-full min-h-[450px] border border-[#6F4E37] rounded overflow-y-auto p-3 resize-none'
            placeholder='문의 내용을 작성해주세요.'
            ref={contentRef}
          ></textarea>
        </div>
        {/* 비밀글 여부 */}
        <div className='flex items-center gap-3 mb-5'>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsPrivate(!isPrivate)
            }}
          >
            {isPrivate ? (
              <SolidCheckCircleIcon className='w-7 text-[#6F4E37]' />
            ) : (
              <OutlineCheckCircleIcon className='w-7 text-gray-600' />
            )}
          </button>
          <p className='mt-auto'>비공개</p>
        </div>
        <input
          type='submit'
          value='문의 제출'
          className='w-full h-[50px] rounded bg-[#A67B5B] hover:bg-[#6F4E37] text-white cursor-pointer'
        />
      </form>
    </div>
  )
}

export default BoardQuestion
