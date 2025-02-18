import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const categories = ['전체', '필독', '일반', '정책', '기술', '홍보']
const debug_mode = localStorage.getItem('debug_mode') === 'true'

const dummyNotices = [
  {
    noticeNo: 1,
    category: '필독',
    title: '서비스 점검 안내',
    adminNo: '관리자',
    date: '2025-01-22',
    reader: '판매자',
  },
  {
    noticeNo: 2,
    category: '일반',
    title: '새로운 기능 업데이트 소식',
    adminNo: '운영팀',
    date: '2025-01-20',
    reader: '이용자',
  },
  {
    noticeNo: 3,
    category: '정책',
    title: '서비스 약관 변경 안내',
    adminNo: '관리자',
    date: '2025-01-18',
    reader: '판매자',
  },
  {
    noticeNo: 4,
    category: '기술',
    title: 'API 사용 가이드 변경',
    adminNo: '기술팀',
    date: '2025-01-17',
    reader: '판매자',
  },
  {
    noticeNo: 5,
    category: '홍보',
    title: '신규 프로모션 안내',
    adminNo: '마케팅팀',
    date: '2025-01-15',
    reader: '판매자,',
  },
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
    <div className='w-full mx-auto p-6 rounded-lg bg-warmBeige/20'>
      {/* 헤더 */}
      <div className='mb-6 text-center'>
        <h1 className='text-3xl font-bold text-espressoBlack'>공지사항</h1>
        <p className='text-md text-coffeeBrown'>중요한 공지사항을 확인하세요.</p>
      </div>

      {/* 카테고리 선택 */}
      <div className='mb-6 flex justify-center items-center space-x-4 text-lg font-semibold'>
        {categories.map((category) => (
          <span
            key={category}
            className={`cursor-pointer transition-colors px-3 py-1 rounded-md ${
              selectedCategory === category
                ? 'bg-caramelTan text-white font-bold'
                : 'text-coffeeBrown hover:text-mochaBrown'
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

      {/* 공지사항 테이블 */}
      <div className='bg-white rounded-lg shadow border border-hazelnutBrown p-4'>
        <table className='w-full text-sm text-espressoBlack'>
          <thead className='bg-caramelTan text-white'>
            <tr>
              <th className='px-4 py-3 text-center'>번호</th>
              <th className='px-4 py-3 text-center'>분류</th>
              <th className='px-4 py-3 text-center'>제목</th>
              <th className='px-4 py-3 text-center'>작성자</th>
              <th className='px-4 py-3 text-center'>작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices
              .filter((notice) => notice.reader === '판매자')
              .map((notice) => (
                <tr
                  key={notice.noticeNo}
                  className='border-b border-caramelTan hover:bg-cobalt-100 cursor-pointer transition'
                  onClick={() => handleClickNavigate(notice.noticeNo)}
                >
                  <td className='px-4 py-3 text-center'>{notice.noticeNo}</td>
                  <td className='px-4 py-3 text-center font-semibold text-mochaBrown'>
                    {notice.category}
                  </td>
                  <td className='px-4 py-3'>{notice.title}</td>
                  <td className='px-4 py-3 text-center text-coffeeBrown'>{notice.adminNo}</td>
                  <td className='px-4 py-3 text-center'>{notice.date}</td>
                </tr>
              ))}
            {currentNotices.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center py-6 text-coffeeBrown'>
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
            className={`px-3 py-2 rounded-md transition ${
              page === currentPage
                ? 'bg-earthBrown/60 text-white'
                : 'bg-forestGreen/40 hover:bg-mossGreen text-white'
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
