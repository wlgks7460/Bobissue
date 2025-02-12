import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

// 고유 키를 반환 (id가 없으면 email 사용)
const getMemberKey = (member) => {
  return member.id ? member.id : member.email
}

const MemberBulkEmail = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원 메일발송' }]

  const [userType, setUserType] = useState('users') // 'users' = 이용자, 'sellers' = 판매자
  const [searchKeyword, setSearchKeyword] = useState('') // 검색 키워드 (이메일 전용)
  const [allMembers, setAllMembers] = useState([]) // 전체 회원 데이터
  const [searchResults, setSearchResults] = useState([]) // 검색 결과
  const [showResults, setShowResults] = useState(false) // 검색 실행 후 결과 표시 여부
  const [selectedMembers, setSelectedMembers] = useState([]) // 선택된 회원의 고유 키 리스트
  const [emailSubject, setEmailSubject] = useState('') // 이메일 제목
  const [emailBody, setEmailBody] = useState('') // 이메일 본문

  // 회원 데이터 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await API.get(userType === 'users' ? '/users' : '/sellers')
        setAllMembers(response.data.result.data)
      } catch (error) {
        console.error('회원 목록 조회 오류:', error)
        alert('회원 목록을 불러오는 데 실패했습니다.')
      }
    }
    fetchMembers()
  }, [userType])

  // 이메일 검색 실행 (이메일만 검색)
  const handleSearch = () => {
    setShowResults(true)
    const filteredMembers = allMembers.filter((member) =>
      member.email?.toLowerCase().includes(searchKeyword.trim().toLowerCase()),
    )
    setSearchResults(filteredMembers)
  }

  // 엔터키로 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 회원 추가/제거 (토글) - 버튼 클릭 시, 고유 키 사용
  const handleToggleRecipient = (key) => {
    setSelectedMembers((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  // 전체 회원 선택 버튼 (전체 회원의 고유 키를 받는 사람 목록에 추가)
  const handleSelectAllMembers = () => {
    setSelectedMembers(allMembers.map((member) => getMemberKey(member)))
  }

  // 이메일 전송 로직 (선택된 회원의 이메일 리스트 사용)
  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) {
      alert('메일 제목과 내용을 입력하세요.')
      return
    }

    const recipients = selectedMembers.length
      ? allMembers
          .filter((member) => selectedMembers.includes(getMemberKey(member)))
          .map((m) => m.email)
      : []

    if (recipients.length === 0) {
      alert('이메일을 발송할 회원을 선택하세요.')
      return
    }

    const emailData = {
      title: emailSubject,
      content: emailBody,
      recipient: recipients,
    }

    try {
      await API.post('/sellers/mail', emailData)
      alert('메일이 성공적으로 발송되었습니다.')
    } catch (error) {
      console.error('메일 발송 오류:', error)
      alert('메일 발송에 실패했습니다.')
    }
  }

  // 선택된 회원의 이메일 목록을 배지 형태로 표시 (고유 키 사용)
  const selectedEmailBadges = allMembers
    .filter((member) => selectedMembers.includes(getMemberKey(member)))
    .map((member) => (
      <span
        key={getMemberKey(member)}
        className='inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2 mb-2 cursor-pointer'
        onClick={() => handleToggleRecipient(getMemberKey(member))}
      >
        {member.email} <span className='ml-1 font-bold'>&times;</span>
      </span>
    ))

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원 메일발송</h1>

      {/* 회원 유형 선택 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 회원 유형 선택</h2>
        <div className='flex space-x-4'>
          <button
            className={`px-4 py-2 rounded-md ${
              userType === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setUserType('users')}
          >
            이용자 회원
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              userType === 'sellers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setUserType('sellers')}
          >
            판매자 회원
          </button>
        </div>
      </section>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 이메일 검색</h2>
        <div className='flex items-center space-x-4'>
          <input
            type='text'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='이메일을 입력하세요'
            className='flex-1 border border-gray-300 rounded-md px-3 py-2'
          />
          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            조회
          </button>
        </div>
      </section>

      {/* 회원 목록 (조회 실행 후 표시) */}
      {showResults && (
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>| 회원 목록</h2>
          {searchResults.length === 0 ? (
            <p className='text-gray-500'>검색 결과가 없습니다.</p>
          ) : (
            <table className='table-auto w-full border border-gray-300'>
              <thead>
                <tr>
                  <th className='border px-4 py-2'>액션</th>
                  <th className='border px-4 py-2'>이메일</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((member, index) => {
                  const key = getMemberKey(member)
                  return (
                    <tr key={key || index}>
                      <td className='border px-4 py-2 text-center'>
                        <button
                          onClick={() => handleToggleRecipient(key)}
                          className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600'
                        >
                          {selectedMembers.includes(key) ? '제거' : '추가'}
                        </button>
                      </td>
                      <td className='border px-4 py-2 text-center'>{member.email}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* 메일 작성 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 메일 작성</h2>
        <div className='mb-4'>
          <h3 className='text-md font-semibold mb-2'>받는 사람:</h3>
          <div className='border p-2 rounded-md min-h-[40px] text-sm text-gray-700 bg-gray-100'>
            {selectedEmailBadges.length > 0 ? selectedEmailBadges : '선택된 회원 없음'}
          </div>
        </div>
        <input
          type='text'
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder='메일 제목'
          className='border w-full mb-2 px-3 py-2'
        />
        <textarea
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder='메일 내용'
          className='border w-full px-3 py-2 h-32'
        />
      </section>

      {/* 전체 회원 선택 버튼 */}
      <button
        onClick={handleSelectAllMembers}
        className='bg-gray-500 text-white px-6 py-2 rounded-md mt-4'
      >
        전체 회원 선택
      </button>

      {/* 메일 전송 버튼 */}
      <button
        onClick={handleSendEmail}
        className='bg-blue-500 text-white px-6 py-2 rounded-md ml-4'
      >
        메일 전송
      </button>
    </div>
  )
}

export default MemberBulkEmail
