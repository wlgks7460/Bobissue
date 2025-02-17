import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import API from '../../../utils/API'
import { StarIcon } from '@heroicons/react/24/solid'

const MyPageReviewCreate = () => {
  const params = useParams()
  const [itemData, setItemData] = useState({})

  const userNo = useSelector((state) => state.user.userInfo.userNo)

  const contentRef = useRef()
  const [rating, setRating] = useState(0)
  const [stars, setStarts] = useState([false, false, false, false, false])
  const [files, setFiles] = useState([])

  const fileInputRef = useRef()

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

  // 리뷰 작성
  const createReview = () => {
    const payload = {
      content: contentRef.current.value,
      rating: rating,
    }

    const formData = new FormData()
    formData.append('review', JSON.stringify(payload))
    files.forEach((obj) => {
      formData.append('images', obj.file)
    })

    if (payload.content.trim() === '') {
      alert('내용을 작성해주세요.')
    } else if (payload.rating < 1) {
      alert('평점은 1점 이상 입니다.')
    } else {
      console.log(payload)
      API.post(`/item/${params.itemNo}/review`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          alert('작성되었습니다.')
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
  // 상품 조회
  const getItemData = () => {
    API.get(`/item/${params.itemNo}`)
      .then((res) => {
        setItemData(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 별점 핸들링
  const handleStar = (idx) => {
    setStarts(stars.map((v, i) => (i <= idx ? true : false)))
    setRating(idx + 1)
  }

  useEffect(() => {
    // mount
    getItemData()
  }, [])
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl mb-5'>후기 작성하기</h2>
      <div>
        <div className='mb-5'>
          <span className='text-gray-400 text-sm me-5'>상품 명</span>
          <span>{itemData.name}</span>
        </div>
        {/* 이미지 첨부하기 */}
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
            placeholder='리뷰 내용을 작성해주세요.'
            ref={contentRef}
          ></textarea>
        </div>
        {/* 별점 */}
        <div className='flex gap-2 items-center mb-5'>
          <div className='flex px-3'>
            {stars.map((v, i) => (
              <button key={`star-${i}`} onClick={() => handleStar(i)}>
                <StarIcon className={`w-7 ${v ? 'text-yellow-400' : 'text-gray-400'}`} />
              </button>
            ))}
          </div>
          <p className='mt-1'>{rating}</p>
        </div>
        {/* 버튼 */}
        <div>
          <button
            className='w-full h-[50px] rounded bg-[#A67B5B] hover:bg-[#6F4E37] text-white'
            onClick={createReview}
          >
            작성하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyPageReviewCreate
