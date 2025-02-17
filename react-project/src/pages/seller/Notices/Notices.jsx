import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const categories = ['전체','필독', '일반', '정책', '기술', '홍보']
const debug_mode = localStorage.getItem('debug_mode') === 'true'

// 더미 데이터
const dummyNotices = [
  { id: 1, category: '필독', title: '서비스 점검 안내', author: '관리자', date: '2025-01-22' },
  { id: 2, category: '일반', title: '새로운 기능 업데이트 소식', author: '운영팀', date: '2025-01-20' },
  { id: 3, category: '정책', title: '서비스 약관 변경 안내', author: '관리자', date: '2025-01-18' },
  { id: 4, category: '기술', title: 'API 사용 가이드 변경', author: '기술팀', date: '2025-01-17' },
  { id: 5, category: '홍보', title: '신규 프로모션 안내', author: '마케팅팀', date: '2025-01-15' },
  { id: 6, category: '안전', title: '보안 강화 업데이트', author: '보안팀', date: '2025-01-14' },
  { id: 7, category: '경고', title: '비정상적 활동 경고', author: '관리자', date: '2025-01-10' },
]

const Notices = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [notices, setNotices] = useState(dummyNotices)
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
  const navigate = useNavigate()

  const noticesPerPage = 4 // 한 페이지당 보여줄 공지 개수
  const maxPageButtons = 5 // 최대 페이지 버튼 개수

  const handleClickNavigate = (id) => {
    const queryString = new URLSearchParams({ id }).toString()
    navigate(`/seller/notices/view?${queryString}`)
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

  // 현재 페이지의 공지사항을 자르기
  const startIndex = (currentPage - 1) * noticesPerPage
  const endIndex = startIndex + noticesPerPage
  const currentNotices = filteredNotices.slice(startIndex, endIndex)

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage)

  // 현재 페이지 그룹 계산
  const currentGroup = Math.ceil(currentPage / maxPageButtons) // 1~5: 그룹 1, 6~10: 그룹 2 ...
  const startPage = (currentGroup - 1) * maxPageButtons + 1
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages)

  // 페이지 변경 핸들러
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className='w-full max-w-[1100px] mx-auto'>
      {/* 제목 */}
      <div className='mb-6 p-4 text-center'>
        <h1 className='text-[28px] font-bold text-gray-900'>공지사항</h1>
        <p className='text-sm text-gray-600'>중요한 공지사항을 확인하세요.</p>
      </div>

      {/* 카테고리 버튼 */}
      <div className='mb-6 flex justify-center items-center space-x-4 text-lg font-semibold text-gray-700'>
        {categories.map((category) => (
          <span
            key={category}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category ? 'text-indigo-600 font-bold' : 'hover:text-indigo-500'
            }`}
            onClick={() => {
              setSelectedCategory(category)
              setCurrentPage(1) // 카테고리 변경 시 1페이지로 이동
            }}
          >
            <h1>{category}</h1>
          </span>
        ))}
      </div>

      {/* 공지사항 리스트 */}
      <div className='bg-white rounded-[10px] overflow-hidden'>
        <table className='w-full text-sm text-gray-700'>
          <thead className='bg-gray-100'>
            <tr className='text-left'>
              <th className='px-4 py-3 w-12 text-center'>번호</th>
              <th className='px-4 py-3 w-24 text-center'>분류</th>
              <th className='px-4 py-3 text-center'>제목</th>
              <th className='px-4 py-3 w-20 text-center'>작성자</th>
              <th className='px-4 py-3 w-28 text-center'>작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices.map((notice, index) => (
              <tr
                key={notice.id}
                className={`border-b transition hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className='px-4 py-3 text-center'>{notice.id}</td>
                <td className='px-4 py-3 text-center font-semibold text-gray-700'>
                  {notice.category}
                </td>
                <td
                  onClick={() => handleClickNavigate(notice.id)}
                  className='px-4 py-3 cursor-pointer hover:underline'
                >
                  {notice.title}
                </td>
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

      {/* 페이지네이션 */}
      <div className='mt-6 flex justify-center space-x-2'>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            className={`px-3 py-2 rounded-md ${
              page === currentPage ? 'bg-sky-500 text-white' : 'bg-gray-200 hover:bg-sky-200'
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
