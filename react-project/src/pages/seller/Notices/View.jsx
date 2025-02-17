import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import API from '@/utils/API'

// 샘플 데이터
const notices = [
  {
    id: 1,
    title: '서비스 점검 안내',
    content: '서비스 점검이 예정되어 있습니다.',
    author: '관리자',
    date: '2025-01-22',
  },
  {
    id: 2,
    title: '새로운 기능 업데이트 소식',
    content: '새로운 기능이 추가되었습니다.',
    author: '운영팀',
    date: '2025-01-20',
  },
  // 추가적인 공지사항 데이터...
]

const NoticeView = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // 쿼리 파라미터에서 id 추출
  const queryParams = new URLSearchParams(location.search)
  const noticeId = parseInt(queryParams.get('id'), 10)

  // 해당 id의 공지사항 찾기
  useEffect(() => {
    async function fetchNotice() {
      try {
        const response = await API.get(`notification/${noticeId}`)
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  })
  //const notice = notices.find((n) => n.id === noticeId)

  // 공지사항이 없을 경우 처리
  if (!notice) {
    return (
      <div className='p-6 bg-gray-100 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>공지사항을 찾을 수 없습니다.</h1>
          <button
            onClick={() => navigate('/seller/notices')}
            className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded'
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='bg-white shadow-md rounded-md p-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>{notice.title}</h1>
        <div className='text-sm text-gray-500 mb-4'>
          작성자: {notice.author} | 작성일: {notice.date}
        </div>
        <p className='text-gray-700 mb-6'>{notice.content}</p>
        <button
          onClick={() => navigate('/seller/notices')}
          className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded'
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default NoticeView
