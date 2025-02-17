import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const categories = ['전체', '필독', '일반', '정책', '기술', '홍보']
const debug_mode = localStorage.getItem('debug_mode') === 'true'

const dummyNotices = [
  { id: 1, category: '필독', title: '서비스 점검 안내', author: '관리자', date: '2025-01-22' },
  {
    id: 2,
    category: '일반',
    title: '새로운 기능 업데이트 소식',
    author: '운영팀',
    date: '2025-01-20',
  },
  { id: 3, category: '정책', title: '서비스 약관 변경 안내', author: '관리자', date: '2025-01-18' },
  { id: 4, category: '기술', title: 'API 사용 가이드 변경', author: '기술팀', date: '2025-01-17' },
  { id: 5, category: '홍보', title: '신규 프로모션 안내', author: '마케팅팀', date: '2025-01-15' },
]

const Notices = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [notices, setNotices] = useState(dummyNotices)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const noticesPerPage = 4
  const maxPageButtons = 5

  const handleClickNavigate = (id) => {
    navigate(`/seller/notices/view?id=${id}`)
  }

  const filteredNotices =
    selectedCategory === '전체'
      ? notices
      : notices.filter((notice) => notice.category === selectedCategory)

  useEffect(() => {
    if (!debug_mode) {
      const fetchNotices = async () => {
        try {
          const response = await API.get('/notification')
          console.log(response.data.result.data)
          setNotices(response.data.result.data)
        } catch (err) {
          console.error('공지사항 불러오기 실패:', err)
        }
      }
      fetchNotices()
    } else {
      setNotices(dummyNotices)
    }
  }, [debug_mode])

  const startIndex = (currentPage - 1) * noticesPerPage
  const endIndex = startIndex + noticesPerPage
  const currentNotices = filteredNotices.slice(startIndex, endIndex)

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage)
  const currentGroup = Math.ceil(currentPage / maxPageButtons)
  const startPage = (currentGroup - 1) * maxPageButtons + 1
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className='w-full  mx-auto bg-gray-50 p-6 rounded-lg '>
      <div className='mb-6 text-center'>
        <h1 className='text-3xl font-bold text-gray-800'>공지사항</h1>
        <p className='text-md text-gray-600'>중요한 공지사항을 확인하세요.</p>
      </div>

      <div className='mb-6 flex justify-center items-center space-x-4 text-lg font-semibold text-gray-700'>
        {categories.map((category) => (
          <span
            key={category}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
            }`}
            onClick={() => {
              setSelectedCategory(category)
              setCurrentPage(1)
            }}
          >
            {category}
          </span>
        ))}
      </div>

      <div className='bg-white rounded-lg shadow border border-gray-300'>
        <table className='w-full text-sm text-gray-700'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='px-4 py-3 text-center'>번호</th>
              <th className='px-4 py-3 text-center'>분류</th>
              <th className='px-4 py-3 text-center'>제목</th>
              <th className='px-4 py-3 text-center'>작성자</th>
              <th className='px-4 py-3 text-center'>작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices.map((notice) => (
              <tr
                key={notice.id}
                className='border-b hover:bg-gray-100 cursor-pointer'
                onClick={() => handleClickNavigate(notice.id)}
              >
                <td className='px-4 py-3 text-center'>{notice.id}</td>
                <td className='px-4 py-3 text-center font-semibold'>{notice.category}</td>
                <td className='px-4 py-3'>{notice.title}</td>
                <td className='px-4 py-3 text-center'>{notice.author}</td>
                <td className='px-4 py-3 text-center'>{notice.date}</td>
              </tr>
            ))}
            {currentNotices.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center py-6 text-gray-500'>
                  해당 분류의 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='mt-6 flex justify-center space-x-2'>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            className={`px-3 py-2 rounded-md transition ${
              page === currentPage ? 'bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-400'
            }`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Notices
