import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const debug_mode = localStorage.getItem('debug_mode') === 'true'

// 샘플 데이터
const dummynotice = {
  id: 1,
  title: '서비스 점검 안내',
  content: '서비스 점검이 예정되어 있습니다.',
  adminNo: '관리자',
  date: '2025-01-22',
  reader: '판매자',
}

// {
//   id: 2,
//   title: '새로운 기능 업데이트 소식',
//   content: '새로운 기능이 추가되었습니다.',
//   adminNo: '운영팀',
//   date: '2025-01-20',
//   reader: '판매자',
// },
// 추가적인 공지사항 데이터...

const NoticeView = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [notice, setNotice] = useState(null)
  // 쿼리 파라미터에서 id 추출
  const queryParams = new URLSearchParams(location.search)
  const noticeId = parseInt(queryParams.get('id'), 10)
  console.log(noticeId)
  // 해당 id의 공지사항 찾기
  useEffect(() => {
    if (debug_mode) {
      setNotice(dummynotice)
      return
    }
    async function fetchNotice() {
      try {
        const response = await API.get(`notification/${noticeId}`)
        setNotice(response.data.result.data)
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
    fetchNotice()
  }, [])
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
    <div className='flex justify-center min-h-screen bg-gray-100 p-6'>
      <div className='h-[60vh] w-full max-w-3xl bg-white shadow-lg rounded-xl p-8'>
        {/* 공지사항 제목 */}
        <h1 className='text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4 text-center'>
          {notice.title}
        </h1>

        {/* 작성자 & 작성일 정보 */}
        <div className='text-sm text-gray-500 mb-6 flex justify-between px-4'>
          <span>
            <span className='font-semibold text-gray-700'>작성자:</span> {notice.adminNo}
          </span>
          <span>
            <span className='font-semibold text-gray-700'>작성일:</span> {notice.date}
          </span>
        </div>

        {/* 공지사항 내용 */}
        <p className='text-lg text-gray-700 leading-relaxed mb-8 px-4'>{notice.content}</p>

        {/* 목록으로 돌아가기 버튼 */}
        <div className='text-center'>
          <button
            onClick={() => navigate('/seller/notices')}
            className='bg-gray-300 hover:bg-gray-400 transition text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-md'
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoticeView
