import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const Notice = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: '공지사항' }]

  const [notices, setNotices] = useState([])
  const [filteredTarget, setFilteredTarget] = useState('전체')
  const [formData, setFormData] = useState({ target: '판매자', title: '', content: '' })
  const [editingNotice, setEditingNotice] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
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
        // 🔹 삭제되지 않은 공지만 필터링
        const activeNotices = response.data.result.data.filter((notice) => notice.delYN === 'N')
        setNotices(activeNotices)
      } else {
        alert('공지사항을 불러오는데 실패했습니다.')
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

  // 입력값 검증
  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요.'
    if (!formData.content.trim()) newErrors.content = '내용을 입력해주세요.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 공지사항 등록
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const response = await API.post('/notification', {
        reader: formData.target,
        title: formData.title,
        content: formData.content,
      })

      console.log('공지사항 등록 응답:', response.data)

      if (response.data?.status === 'CREATED') {
        alert('공지사항이 성공적으로 등록되었습니다!')
        setFormData({ target: '판매자', title: '', content: '' }) // 입력 초기화
        setShowCreateForm(false) // 폼 숨기기
        fetchNotices() // 공지사항 목록 갱신
      } else {
        alert(`공지사항 등록 실패: ${response.data?.message?.label || response.statusText}`)
      }
    } catch (error) {
      console.error('공지사항 등록 오류:', error.response || error.message)
      alert('공지사항 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 수정 버튼 클릭
  const handleEditClick = (notice) => {
    setEditingNotice({ ...notice }) // 수정할 데이터 반영
  }

  // 공지사항 수정
  const handleEditNotice = async () => {
    if (!editingNotice.title.trim() || !editingNotice.content.trim()) {
      alert('제목과 내용을 입력하세요.')
      return
    }

    try {
      const response = await API.put(`/notification/${editingNotice.noticeNo}`, {
        title: editingNotice.title,
        content: editingNotice.content,
        reader: editingNotice.reader || '판매자',
      })

      if (response.data.status === 'OK') {
        alert('공지사항이 수정되었습니다.')
        setEditingNotice(null) // 수정 상태 초기화
        fetchNotices() // 목록 갱신
      }
    } catch (error) {
      console.error('공지사항 수정 오류:', error.response || error.message)
      alert('공지사항 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 공지사항 삭제
  const handleDeleteNotice = async (noticeNo) => {
    console.log('삭제하려는 공지 번호:', noticeNo) // 디버깅 로그 추가
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await API.delete(`/notification/${noticeNo}`)
        console.log('삭제 응답:', response.data) // 서버 응답 확인
        if (response.data.status === 'OK') {
          alert('공지사항이 삭제되었습니다.')
          // 상태에서 삭제된 항목 제거
          setNotices((prevNotices) => prevNotices.filter((notice) => notice.noticeNo !== noticeNo))
        } else {
          alert('공지사항 삭제 실패: ' + response.data.message?.label || '알 수 없는 오류')
        }
      } catch (error) {
        console.error('공지사항 삭제 오류:', error.response || error.message)
        alert('공지사항 삭제에 실패했습니다. 다시 시도해주세요.')
      }
    }
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />

      <h2 className='text-2xl font-bold mb-6'>공지사항</h2>

      {/* 공지 필터링 */}
      <section className='mb-6'>
        <label className='block text-sm font-medium mb-2'>공지 대상을 선택하세요</label>
        <select
          value={filteredTarget}
          onChange={(e) => setFilteredTarget(e.target.value)}
          className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
        >
          <option value='전체'>전체</option>
          <option value='판매자'>판매자</option>
          <option value='이용자'>이용자</option>
        </select>
      </section>

      {/* 공지 목록 */}
      <section className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>| 공지 목록</h3>
        {notices.length > 0 ? (
          <table className='w-full border-collapse border'>
            <thead>
              <tr>
                <th className='border p-2'>번호</th>
                <th className='border p-2'>대상</th>
                <th className='border p-2'>제목</th>
                <th className='border p-2'>내용</th>
                <th className='border p-2'>수정</th>
                <th className='border p-2'>삭제</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.noticeNo}>
                  <td className='border p-2'>{notice.noticeNo}</td>
                  <td className='border p-2'>{notice.reader}</td>
                  <td className='border p-2'>{notice.title}</td>
                  <td className='border p-2'>{notice.content}</td>
                  <td className='border p-2 text-center'>
                    <button
                      onClick={() => handleEditClick(notice)}
                      className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
                    >
                      수정
                    </button>
                  </td>
                  <td className='border p-2 text-center'>
                    <button
                      onClick={() => handleDeleteNotice(notice.noticeNo)}
                      className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-gray-500 text-center py-4'>공지 목록이 존재하지 않습니다.</p>
        )}
      </section>

      {/* 공지 등록 버튼 */}
      <button
        onClick={() => setShowCreateForm((prev) => !prev)}
        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
      >
        {showCreateForm ? '등록 취소' : '공지사항 등록하기'}
      </button>

      {/* 공지 등록 폼 */}
      {showCreateForm && (
        <form
          onSubmit={handleSubmit}
          className='mt-6 p-4 border border-gray-300 rounded-md shadow-md bg-gray-50'
        >
          <div className='mb-4'>
            <label htmlFor='noticeTarget' className='block text-sm font-medium mb-1'>
              공지 대상
            </label>
            <select
              id='noticeTarget'
              name='target'
              value={formData.target}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='판매자'>판매자</option>
              <option value='이용자'>이용자</option>
            </select>
          </div>
          <div className='mb-4'>
            <label htmlFor='noticeTitle' className='block text-sm font-medium mb-1'>
              제목
            </label>
            <input
              id='noticeTitle'
              name='title'
              type='text'
              value={formData.title}
              onChange={handleChange}
              placeholder='제목을 입력하세요'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            />
            {errors.title && <div className='text-red-500 text-sm mt-1'>{errors.title}</div>}
          </div>
          <div className='mb-4'>
            <label htmlFor='noticeContent' className='block text-sm font-medium mb-1'>
              내용
            </label>
            <textarea
              id='noticeContent'
              name='content'
              value={formData.content}
              onChange={handleChange}
              placeholder='내용을 입력하세요'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              rows='4'
            />
            {errors.content && <div className='text-red-500 text-sm mt-1'>{errors.content}</div>}
          </div>
          <div className='flex space-x-4'>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            >
              등록 완료
            </button>
            <button
              type='button'
              onClick={() => setShowCreateForm(false)}
              className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* 공지 수정 폼 */}
      {editingNotice && (
        <section className='mt-6 p-4 border border-gray-300 rounded-md shadow-md bg-gray-50'>
          <h3 className='text-lg font-semibold mb-4'>| 공지 수정</h3>
          <div className='mb-4'>
            <label htmlFor='editNoticeTarget' className='block text-sm font-medium mb-1'>
              공지 대상
            </label>
            <select
              id='editNoticeTarget'
              name='reader'
              value={editingNotice.reader}
              onChange={(e) => setEditingNotice((prev) => ({ ...prev, reader: e.target.value }))}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='판매자'>판매자</option>
              <option value='이용자'>이용자</option>
            </select>
          </div>
          <div className='mb-4'>
            <label htmlFor='editNoticeTitle' className='block text-sm font-medium mb-1'>
              제목
            </label>
            <input
              id='editNoticeTitle'
              name='title'
              type='text'
              value={editingNotice.title}
              onChange={(e) => setEditingNotice((prev) => ({ ...prev, title: e.target.value }))}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='editNoticeContent' className='block text-sm font-medium mb-1'>
              내용
            </label>
            <textarea
              id='editNoticeContent'
              name='content'
              value={editingNotice.content}
              onChange={(e) => setEditingNotice((prev) => ({ ...prev, content: e.target.value }))}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              rows='4'
            />
          </div>
          <div className='flex space-x-4'>
            <button
              onClick={handleEditNotice}
              className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
            >
              수정 완료
            </button>
            <button
              onClick={() => setEditingNotice(null)}
              className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
            >
              취소
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default Notice
