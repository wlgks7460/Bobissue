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

  // 공지사항 목록 조회
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
      {/* 공지 등록 버튼 (토글) */}
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className='bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600'
      >
        {showForm ? '등록 취소' : '공지 등록'}
      </button>
      {/* 공지 등록 폼 */}
      {showForm && (
        <section className='mb-6 p-4 border border-gray-300 rounded-md shadow-md bg-gray-50'>
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
      {/* 공지 목록 */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {notices.map((notice) => (
          <div
            key={notice.noticeNo}
            className='bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition'
            onClick={() => handleNoticeClick(notice.noticeNo)}
          >
            <h3 className='text-lg font-semibold text-gray-800'>
              {notice.noticeNo}. {notice.title}
            </h3>
            <p className='text-sm text-gray-500 mt-2'>
              <span className='font-bold'>{notice.reader}</span> 공지
            </p>
          </div>
        ))}
      </section>
      {/* // 모달 창 내에서 줄바꿈 반영하여 표시 */}
      {selectedNotice && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full'>
            {isEditing ? (
              <>
                <input
                  className='border w-full p-2 mb-2'
                  value={selectedNotice.title}
                  onChange={(e) => setSelectedNotice({ ...selectedNotice, title: e.target.value })}
                />
                <textarea
                  className='border w-full p-2 mb-2'
                  value={selectedNotice.content}
                  onChange={(e) =>
                    setSelectedNotice({ ...selectedNotice, content: e.target.value })
                  }
                />
                <button
                  className='bg-green-500 text-white px-4 py-2 mr-2 rounded-md hover:bg-green-600'
                  onClick={handleEditNotice}
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <h2 className='text-xl font-bold'>{selectedNotice.title}</h2>
                <p className='text-sm mt-1'>
                  공지대상 : <span className='text-black font-bold'>{selectedNotice.reader}</span>{' '}
                  {selectedNotice.createdAt}
                </p>
                <p className='mt-3 mb-4'>{formatContent(selectedNotice.content)}</p>
              </>
            )}

            {/* 수정 / 삭제 / 닫기 버튼 */}
            <div className='mt-4 flex justify-end space-x-4'>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className='bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600'
              >
                수정
              </button>
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
