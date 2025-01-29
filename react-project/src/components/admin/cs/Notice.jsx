import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const Notice = () => {
  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: '공지사항' }]

  // 상태 관리
  const [notices, setNotices] = useState([
    {
      id: 1,
      target: '판매자',
      title: '설 연휴 배송 안내',
      content: '설 연휴 동안 배송이 지연될 수 있습니다.',
      date: '2025-01-25',
    },
    {
      id: 2,
      target: '이용자',
      title: '서비스 점검 공지',
      content: '1월 28일 서비스 점검이 예정되어 있습니다.',
      date: '2025-01-24',
    },
  ])
  const [filteredTarget, setFilteredTarget] = useState('전체') // 필터링 대상
  const [newNotice, setNewNotice] = useState({ target: '판매자', title: '', content: '' })
  const [editingNotice, setEditingNotice] = useState(null) // 수정 중인 공지사항

  // 공지 필터링
  const filteredNotices =
    filteredTarget === '전체'
      ? notices
      : notices.filter((notice) => notice.target === filteredTarget)

  // 공지 작성 핸들러
  const handleCreateNotice = () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      alert('제목과 내용을 입력하세요.')
      return
    }

    setNotices((prev) => [
      ...prev,
      { id: Date.now(), ...newNotice, date: new Date().toISOString().split('T')[0] },
    ])
    setNewNotice({ target: '판매자', title: '', content: '' })
  }

  // 공지 수정 핸들러
  const handleEditNotice = () => {
    if (!editingNotice.title.trim() || !editingNotice.content.trim()) {
      alert('제목과 내용을 입력하세요.')
      return
    }

    setNotices((prev) =>
      prev.map((notice) => (notice.id === editingNotice.id ? editingNotice : notice)),
    )
    setEditingNotice(null)
  }

  // 공지 삭제 핸들러
  const handleDeleteNotice = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setNotices((prev) => prev.filter((notice) => notice.id !== id))
    }
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
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
        <table className='w-full border-collapse border'>
          <thead>
            <tr>
              <th className='border p-2'>번호</th>
              <th className='border p-2'>대상</th>
              <th className='border p-2'>제목</th>
              <th className='border p-2'>날짜</th>
              <th className='border p-2'>수정</th>
              <th className='border p-2'>삭제</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice) => (
              <tr key={notice.id}>
                <td className='border p-2'>{notice.id}</td>
                <td className='border p-2'>{notice.target}</td>
                <td className='border p-2'>{notice.title}</td>
                <td className='border p-2'>{notice.date}</td>
                <td className='border p-2 text-center'>
                  <button
                    onClick={() => setEditingNotice(notice)}
                    className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
                  >
                    수정
                  </button>
                </td>
                <td className='border p-2 text-center'>
                  <button
                    onClick={() => handleDeleteNotice(notice.id)}
                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 공지 작성 */}
      {!editingNotice && (
        <section className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>| 공지 작성</h3>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>공지 대상</label>
            <select
              value={newNotice.target}
              onChange={(e) => setNewNotice((prev) => ({ ...prev, target: e.target.value }))}
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='판매자'>판매자</option>
              <option value='이용자'>이용자</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>제목</label>
            <input
              type='text'
              value={newNotice.title}
              onChange={(e) => setNewNotice((prev) => ({ ...prev, title: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>내용</label>
            <textarea
              value={newNotice.content}
              onChange={(e) => setNewNotice((prev) => ({ ...prev, content: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <button
            onClick={handleCreateNotice}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            공지 작성
          </button>
        </section>
      )}

      {/* 공지 수정 */}
      {editingNotice && (
        <section className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>| 공지 수정</h3>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>공지 대상</label>
            <select
              value={editingNotice.target}
              onChange={(e) => setEditingNotice((prev) => ({ ...prev, target: e.target.value }))}
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='판매자'>판매자</option>
              <option value='이용자'>이용자</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>제목</label>
            <input
              type='text'
              value={editingNotice.title}
              onChange={(e) => setEditingNotice((prev) => ({ ...prev, title: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>내용</label>
            <textarea
              value={editingNotice.content}
              onChange={(e) => setEditingNotice((prev) => ({ ...prev, content: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <button
            onClick={handleEditNotice}
            className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
          >
            공지 수정
          </button>
          <button
            onClick={() => setEditingNotice(null)}
            className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-4'
          >
            취소
          </button>
        </section>
      )}
    </div>
  )
}

export default Notice
