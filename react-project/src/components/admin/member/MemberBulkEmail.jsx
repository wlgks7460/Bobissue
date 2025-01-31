import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MemberBulkEmail = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원 일괄메일발송' }]

  const [searchFilter, setSearchFilter] = useState('name') // 검색 필터 (기본: 이름)
  const [searchKeyword, setSearchKeyword] = useState('') // 검색 키워드
  const [allMembers, setAllMembers] = useState([]) // 모든 회원 데이터
  const [searchResults, setSearchResults] = useState([]) // 검색 결과
  const [selectedMembers, setSelectedMembers] = useState([]) // 선택된 회원
  const [emailSubject, setEmailSubject] = useState('') // 이메일 제목
  const [emailBody, setEmailBody] = useState('') // 이메일 본문

  // 회원 데이터 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await API.get('/users') // 실제 API 호출
        setAllMembers(response.data.result.data) // API 응답에서 회원 데이터 설정
      } catch (error) {
        console.error('회원 목록 조회 오류:', error)
        alert('회원 목록을 불러오는 데 실패했습니다.')
      }
    }

    fetchMembers()
  }, [])

  // 회원 검색
  const handleSearch = () => {
    const filteredMembers = allMembers.filter((member) =>
      member[searchFilter]?.toString().toLowerCase().includes(searchKeyword.trim().toLowerCase()),
    )
    setSearchResults(filteredMembers)
  }

  // 회원 선택
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
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원 일괄메일발송</h1>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 회원 검색</h2>
        <div className='flex items-center space-x-4'>
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2'
          >
            <option value='name'>이름</option>
            <option value='email'>이메일</option>
          </select>
          <input
            type='text'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder='검색어를 입력하세요'
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

      {/* 회원 목록 */}
      {searchResults.length > 0 && (
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>| 회원 목록</h2>
          <table className='table-auto w-full border border-gray-300'>
            <thead>
              <tr>
                <th className='border px-4 py-2'>선택</th>
                <th className='border px-4 py-2'>이름</th>
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
                  <td className='border px-4 py-2 text-center'>{member.name}</td>
                  <td className='border px-4 py-2 text-center'>{member.phoneNumber}</td>
                  <td className='border px-4 py-2 text-center'>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 메일 작성 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 메일 작성</h2>
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

      {/* 메일 전송 버튼 */}
      <button onClick={handleSendEmail} className='bg-blue-500 text-white px-6 py-2 rounded-md'>
        메일 전송
      </button>
    </div>
  )
}

export default MemberBulkEmail
