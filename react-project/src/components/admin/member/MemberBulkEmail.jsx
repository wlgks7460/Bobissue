import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const MemberBulkEmail = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '회원관리' },
    { name: '회원관리' },
    { name: '회원 일괄메일발송' },
  ]

  const [searchFilter, setSearchFilter] = useState('name') // 검색 필터 (기본: 이름)
  const [searchKeyword, setSearchKeyword] = useState('') // 검색 키워드
  const [searchResults, setSearchResults] = useState([]) // 조회 결과
  const [selectedMembers, setSelectedMembers] = useState([]) // 선택된 회원
  const [emailSubject, setEmailSubject] = useState('') // 메일 제목
  const [emailBody, setEmailBody] = useState('') // 메일 내용

  // 샘플 데이터
  const allMembers = [
    {
      id: 1,
      name: '홍길동',
      phone: '010-1234-5678',
      email: 'hong@example.com',
      username: 'hong123',
    },
    { id: 2, name: '김철수', phone: '010-5678-1234', email: 'kim@example.com', username: 'kim234' },
    { id: 3, name: '이영희', phone: '010-1111-2222', email: 'lee@example.com', username: 'lee345' },
  ]

  // 회원 검색
  const handleSearch = () => {
    const filteredMembers = allMembers.filter((member) => {
      const targetValue = member[searchFilter]?.toString().toLowerCase() || ''
      return targetValue.includes(searchKeyword.trim().toLowerCase())
    })
    setSearchResults(filteredMembers)
  }

  // 개별 회원 선택
  const handleMemberSelect = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id],
    )
  }

  const handleSendEmail = () => {
    if (!emailSubject || !emailBody) {
      alert('메일 제목과 내용을 입력하세요.')
      return
    }

    const recipients = selectedMembers.length
      ? searchResults.filter((member) => selectedMembers.includes(member.id))
      : allMembers

    console.log('메일 제목:', emailSubject)
    console.log('메일 내용:', emailBody)
    console.log('수신 대상:', recipients)
    alert(
      selectedMembers.length
        ? '선택된 회원에게 메일이 발송되었습니다.'
        : '전체 회원에게 메일이 발송되었습니다.',
    )
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h1 className='text-2xl font-bold mb-6'>회원 일괄메일발송</h1>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 회원 검색</h2>
        <div className='flex items-center space-x-4'>
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value='username'>아이디</option>
            <option value='name'>이름</option>
            <option value='phone'>전화번호</option>
            <option value='email'>이메일</option>
          </select>
          <input
            type='text'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder='검색어를 입력하세요'
            className='flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            조회
          </button>
        </div>
      </section>

      {/* 조회 결과 */}
      {searchResults.length > 0 && (
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>| 회원 목록</h2>
          <table className='table-auto w-full border border-gray-300'>
            <thead>
              <tr>
                <th className='border px-4 py-2'>선택</th>
                <th className='border px-4 py-2'>아이디</th>
                <th className='border px-4 py-2'>회원명</th>
                <th className='border px-4 py-2'>전화번호</th>
                <th className='border px-4 py-2'>이메일</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((member) => (
                <tr key={member.id}>
                  <td className='border px-4 py-2 text-center'>
                    <input
                      type='checkbox'
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberSelect(member.id)}
                    />
                  </td>
                  <td className='border px-4 py-2'>{member.username}</td>
                  <td className='border px-4 py-2'>{member.name}</td>
                  <td className='border px-4 py-2'>{member.phone}</td>
                  <td className='border px-4 py-2'>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 발송 대상자 미리보기 */}
      {selectedMembers.length > 0 && (
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>| 발송 대상자 미리보기</h2>
          <ul className='list-disc pl-6'>
            {searchResults
              .filter((member) => selectedMembers.includes(member.id))
              .map((member) => (
                <li key={member.id}>
                  {member.name} ({member.email})
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* 메일 작성 */}
      <section className='mb-6'>
        {/* 안내문 */}
        <p className='text-sm text-gray-600 mb-4'>
          회원을 선택하지 않을 경우 전체 회원을 대상으로 메일이 발송됩니다.
        </p>
        <h2 className='text-lg font-semibold mb-4'>| 메일 작성</h2>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>메일 제목</label>
          <input
            type='text'
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder='메일 제목을 입력하세요'
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>메일 내용</label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder='메일 내용을 입력하세요'
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            rows={6}
          />
        </div>
      </section>

      {/* 발송 버튼 */}
      <div className='space-x-4'>
        <button
          onClick={handleSendEmail}
          className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600'
        >
          제출하기
        </button>
      </div>
    </div>
  )
}

export default MemberBulkEmail
