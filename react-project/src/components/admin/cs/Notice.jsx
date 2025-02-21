import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const Notice = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: '공지사항' }]
  const [notices, setNotices] = useState([])
  const [filteredTarget, setFilteredTarget] = useState('전체')
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showForm, setShowForm] = useState(false) // 🔹 등록 폼 토글 상태
  const [formData, setFormData] = useState({ target: '판매자', title: '', content: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchNotices()
  }, [filteredTarget])

  const fetchNotices = async () => {
    try {
      let url = '/notification'
      if (filteredTarget === '이용자') url = '/notification/user-only'
      if (filteredTarget === '판매자') url = '/notification/seller-only'

      const response = await API.get(url)
      if (response.data.status === 'OK') {
        const activeNotices = response.data.result.data.filter((notice) => notice.delYN === 'N')
        setNotices(activeNotices)
      }
    } catch (error) {
      console.error('공지사항 조회 오류:', error)
    }
  }

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: '', // 입력 시 기존 에러 메시지 초기화
    })
  }

  // 공지사항 내용 줄바꿈 반영하여 표시
  const formatContent = (content) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))
  }

  // 공지 등록
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrors({
        title: formData.title.trim() ? '' : '제목을 입력하세요.',
        content: formData.content.trim() ? '' : '내용을 입력하세요.',
      })
      return
    }

    try {
      const response = await API.post('/notification', {
        reader: formData.target,
        title: formData.title,
        content: formData.content,
      })

      if (response.data?.status === 'CREATED') {
        alert('공지사항이 등록되었습니다!')
        setFormData({ target: '판매자', title: '', content: '' })
        setShowForm(false) // 등록 후 폼 닫기
        fetchNotices()
      }
    } catch (error) {
      console.error('공지사항 등록 오류:', error)
      alert('공지사항 등록 실패')
    }
  }

  // 공지 상세 조회
  const handleNoticeClick = async (noticeNo) => {
    try {
      const response = await API.get(`/notification/${noticeNo}`)
      if (response.data.status === 'OK') {
        setSelectedNotice(response.data.result.data) // 🔹 응답 데이터 구조 수정
      }
    } catch (error) {
      console.error('공지 상세 조회 오류:', error)
      alert('공지사항을 불러오는데 실패했습니다.')
    }
  }

  // 공지 수정
  const handleEditNotice = async () => {
    if (!selectedNotice.title.trim() || !selectedNotice.content.trim()) {
      alert('제목과 내용을 입력하세요.')
      return
    }

    try {
      const response = await API.put(`/notification/${selectedNotice.noticeNo}`, {
        title: selectedNotice.title,
        content: selectedNotice.content,
        reader: selectedNotice.reader || '판매자',
      })

      if (response.data.status === 'OK') {
        alert('공지사항이 수정되었습니다.')
        fetchNotices()
        setIsEditing(false)
      }
    } catch (error) {
      console.error('공지 수정 오류:', error)
      alert('공지 수정 실패')
    }
  }

  // 공지 삭제
  const handleDeleteNotice = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await API.delete(`/notification/${selectedNotice.noticeNo}`)
        if (response.data.status === 'OK') {
          alert('공지사항이 삭제되었습니다.')
          setSelectedNotice(null) // 모달 닫기
          fetchNotices() // 목록 갱신
        }
      } catch (error) {
        console.error('공지 삭제 오류:', error)
        alert('공지 삭제 실패')
      }
    }
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>공지사항</h2>

      <div className='flex items-center justify-between mb-4'>
        {/* 공지 대상 필터와 공지 등록 버튼을 같은 flex 컨테이너에 배치 */}
        <div className='flex items-center'>
          {/* 공지 대상 필터 */}
          <select
            className='border border-gray-300 rounded-md px-3 py-2 mr-4' // `mr-4`로 필터와 버튼 간격 조정
            value={filteredTarget}
            onChange={(e) => setFilteredTarget(e.target.value)}
          >
            <option value='전체'>전체</option>
            <option value='판매자'>판매자</option>
            <option value='이용자'>이용자</option>
          </select>

          {/* 공지 등록 버튼 */}
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className='bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-md shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300'
          >
            {showForm ? '등록 취소' : '공지 등록'}
          </button>
        </div>
      </div>

      {/* 공지 등록 폼 */}
      {showForm && (
        <section
          className='mb-6 p-4 border border-gray-300 rounded-md shadow-md bg-gray-50'
          style={{ maxWidth: '800px' }} // 🔹 폼의 최대 가로 폭을 설정
        >
          <h3 className='text-lg font-semibold mb-4'>| 공지 등록</h3>
          <form onSubmit={handleSubmit}>
            <label className='block text-sm font-medium mb-1'>공지 대상</label>
            <select
              name='target'
              value={formData.target}
              onChange={handleChange}
              className='border border-gray-300 rounded-md px-3 py-2 w-full mb-4'
            >
              <option value='판매자'>판매자</option>
              <option value='이용자'>이용자</option>
            </select>

            <input
              name='title'
              type='text'
              value={formData.title}
              onChange={handleChange}
              placeholder='제목을 입력하세요'
              className='border border-gray-300 rounded-md px-3 py-2 w-full mb-2'
            />
            {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}

            <textarea
              name='content'
              value={formData.content}
              onChange={handleChange}
              placeholder='내용을 입력하세요'
              className='border border-gray-300 rounded-md px-3 py-2 w-full mb-2'
              rows='4'
            />
            {errors.content && <p className='text-red-500 text-sm'>{errors.content}</p>}

            <button className='bg-blue-500 text-white px-4 py-2 rounded-md w-full'>등록</button>
          </form>
        </section>
      )}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {notices.map((notice) => (
          <div
            key={notice.noticeNo}
            className={`relative p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105
        ${
          notice.reader === '판매자'
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-white'
            : 'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-white'
        }`}
            onClick={() => handleNoticeClick(notice.noticeNo)}
          >
            <div className='absolute top-4 right-4'>
              <span
                className={`text-xs font-normal text-white px-3 py-1 rounded-full ${
                  notice.reader === '판매자' ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                {notice.reader}
              </span>
            </div>
            <h3
              className='text-lg font-bold text-blue-700 truncate mb-2'
              style={{ maxWidth: 'calc(100% - 60px)' }} // 배지와 제목 간격 확보
              title={notice.title} // 툴팁으로 전체 제목 표시
            >
              {notice.noticeNo}. {notice.title}
            </h3>
            <p className='text-sm text-gray-600 line-clamp-2 mt-2'>{notice.title}</p>
            <p className='text-xs text-gray-400 mt-2'>클릭하여 더보기 →</p>
          </div>
        ))}
      </section>

      {/* 모달 창 */}
      {selectedNotice && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div
            className='bg-white p-6 rounded-lg shadow-lg overflow-hidden relative'
            style={{
              width: '700px', // 고정된 가로 크기
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {/* 모달 내용 */}
            {isEditing ? (
              <>
                <input
                  className='border w-full p-2 mb-2'
                  style={{ width: '100%' }} // 입력 필드가 모달 가로 크기를 차지하도록 설정
                  value={selectedNotice.title}
                  onChange={(e) => setSelectedNotice({ ...selectedNotice, title: e.target.value })}
                />
                <textarea
                  className='border w-full p-2 mb-2'
                  style={{ width: '100%', height: '200px' }} // 텍스트 영역 크기 설정
                  value={selectedNotice.content}
                  onChange={(e) =>
                    setSelectedNotice({ ...selectedNotice, content: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <h2 className='text-xl font-bold'>{selectedNotice.title}</h2>
                <p className='text-lg mt-2 text-right mb-6'>
                  {' '}
                  {/* 우측 정렬과 아래 여백 추가 */}
                  공지대상 : <span className='text-black font-bold'>
                    {selectedNotice.reader}
                  </span>{' '}
                  {selectedNotice.createdAt}
                </p>
                <p className='mt-3 mb-6'>{formatContent(selectedNotice.content)}</p>{' '}
                {/* 여백 추가 */}
              </>
            )}

            {/* 수정 / 삭제 / 닫기 버튼 */}
            <div className='mt-4 flex justify-end space-x-4'>
              {isEditing ? (
                <button
                  onClick={handleEditNotice} // 수정 상태에서 저장 버튼 클릭 시 수정 처리
                  className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
                >
                  저장
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)} // 수정 상태로 전환
                  className='bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600'
                >
                  수정
                </button>
              )}
              <button
                onClick={handleDeleteNotice}
                className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
              >
                삭제
              </button>
              <button
                onClick={() => setSelectedNotice(null)}
                className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notice
