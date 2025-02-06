import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const notices = [
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
  { id: 6, category: '안전', title: '보안 강화 업데이트', author: '보안팀', date: '2025-01-14' },
  { id: 7, category: '경고', title: '비정상적 활동 경고', author: '관리자', date: '2025-01-10' },
]

const categories = ['전체', '필독', '일반', '정책', '기술', '홍보', '안전', '경고']

const Notices = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const navigate = useNavigate()

  const HandleClicknavigate = (id) => {
    const queryString = new URLSearchParams({ id }).toString()
    navigate(`/seller/notices/view?${queryString}`)
  }

  const filteredNotices =
    selectedCategory === '전체'
      ? notices
      : notices.filter((notice) => notice.category === selectedCategory)

  return (
    <div className='w-[1100px]'>
      <div className='mb-6'>
        <h1 className='text-[28px] font-bold text-gray-800'>공지사항</h1>
        <p className='text-sm text-gray-600'>중요한 공지사항을 확인하세요.</p>
      </div>

      <div className='mb-6 ml-[24px]'>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-2 w-[120px] text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className=' bg-white rounded-md p-6 w-[1010px]'>
        <table className='table-fixed w-full text-sm'>
          <thead>
            <tr className='bg-gray-200 text-gray-700'>
              <th className='px-4 py-2 w-16'>번호</th>
              <th className='px-4 py-2 w-32'>분류</th>
              <th className='px-4 py-2'>제목</th>
              <th className='px-4 py-2 w-24'>작성자</th>
              <th className='px-4 py-2 w-32'>작성일</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice) => (
              <tr key={notice.id} className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2 text-center'>{notice.id}</td>
                <td
                  className={`px-4 py-2 text-center font-semibold ${
                    notice.category === '필독'
                      ? 'text-red-500'
                      : notice.category === '경고'
                        ? 'text-yellow-500'
                        : notice.category === '안전'
                          ? 'text-green-500'
                          : 'text-gray-700'
                  }`}
                >
                  {notice.category}
                </td>
                <td
                  onClick={() => HandleClicknavigate(notice.id)}
                  className='px-4 py-2 cursor-pointer'
                >
                  {notice.title}
                </td>
                <td className='px-4 py-2 text-center'>{notice.author}</td>
                <td className='px-4 py-2 text-center'>{notice.date}</td>
              </tr>
            ))}
            {filteredNotices.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center py-4 text-gray-500'>
                  해당 분류의 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Notices
