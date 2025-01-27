import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const Notification = () => {
  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: '알림관리' }]

  // 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearched, setIsSearched] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [selectedMemberIds, setSelectedMemberIds] = useState([]) // 선택된 회원 ID
  const [notificationText, setNotificationText] = useState('') // 알림 내용

  // 검색 핸들러
  const handleSearch = () => {
    // API 요청 등을 통해 검색 결과 가져오기 (임시 데이터 사용)
    const mockResults = [
      { id: 1, name: '김철수', email: 'kim@example.com' },
      { id: 2, name: '이영희', email: 'lee@example.com' },
    ]
    setSearchResults(mockResults)
    setIsSearched(true)
  }

  // 회원 선택 핸들러
  const toggleSelectMember = (id) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id],
    )
  }

  // 알림 전송 핸들러
  const sendNotification = () => {
    if (!notificationText.trim()) {
      alert('알림 내용을 입력하세요.')
      return
    }
    if (selectedMemberIds.length === 0) {
      alert('회원 한 명 이상을 선택하세요.')
      return
    }

    // API 호출로 알림 전송 (가상)
    console.log('전송할 데이터:', {
      members: selectedMemberIds,
      message: notificationText,
    })

    alert('알림이 성공적으로 전송되었습니다!')
    setSelectedMemberIds([])
    setNotificationText('')
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h1 className='text-2xl font-bold mb-6'>알림관리</h1>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>

        <div className='flex items-center mb-4 space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>검색어</label>
            <select className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'>
              <option>아이디</option>
              <option>회원명</option>
              <option>휴대폰</option>
              <option>이메일</option>
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>검색 입력</label>
            <input
              type='text'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              placeholder='검색어를 입력하세요'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            조회
          </button>
        </div>
      </section>

      {/* 조회 결과 */}
      {isSearched && (
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>조회 결과</h2>
          <table className='w-full border-collapse border'>
            <thead>
              <tr>
                <th className='border p-2'>선택</th>
                <th className='border p-2'>이름</th>
                <th className='border p-2'>이메일</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((member) => (
                <tr key={member.id}>
                  <td className='border p-2 text-center'>
                    <input
                      type='checkbox'
                      checked={selectedMemberIds.includes(member.id)}
                      onChange={() => toggleSelectMember(member.id)}
                    />
                  </td>
                  <td className='border p-2'>{member.name}</td>
                  <td className='border p-2'>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 알림 작성 및 전송 */}
      {selectedMemberIds.length > 0 && (
        <section>
          <h2 className='text-lg font-semibold mb-4'>알림 작성</h2>
          <textarea
            className='w-full border p-2 rounded mb-4'
            rows='5'
            placeholder='알림 내용을 입력하세요'
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
          />
          <button onClick={sendNotification} className='bg-blue-500 text-white px-6 py-2 rounded'>
            알림 보내기
          </button>
        </section>
      )}
    </div>
  )
}

export default Notification
