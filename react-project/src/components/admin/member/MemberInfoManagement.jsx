import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // React Router 사용
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MemberInfoManagement = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원정보관리' }]
  const navigate = useNavigate() // useNavigate 사용

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchType, setSearchType] = useState('user-no') // 기본 검색 유형은 회원 번호
  const [level, setLevel] = useState('전체') // 회원 레벨
  const [filteredUsers, setFilteredUsers] = useState([]) // 필터링된 결과
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      if (!searchKeyword) {
        // 전체 조회
        const response = await API.get('/users')
        setFilteredUsers(response.data.result.data)
      } else if (searchType === 'user-no') {
        // 특정 회원 조회
        const response = await API.get(`/users/${searchKeyword}`)
        setFilteredUsers([response.data.result]) // 단일 데이터 배열로 설정
      } else {
        // 키워드 검색 + 필터링
        const response = await API.get('/users')
        const filtered = response.data.result.data.filter((user) => {
          const matchesSearch =
            searchType === '회원명'
              ? user.name.includes(searchKeyword)
              : searchType === '이메일'
                ? user.email.includes(searchKeyword)
                : true

          const matchesLevel = level === '전체' || user.level === level
          return matchesSearch && matchesLevel
        })
        setFilteredUsers(filtered)
      }
    } catch (error) {
      console.error('회원 조회 중 오류 발생:', error)
      alert('회원 조회에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigateToDetail = (userNo) => {
    navigate(`/admin/members/${userNo}`) // 절대 경로로 이동
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h1 className='text-2xl font-bold mb-6'>회원정보관리</h1>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>
        <div className='flex items-center mb-4 space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>검색어</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='user-no'>회원번호</option>
              <option value='회원명'>회원명</option>
              <option value='이메일'>이메일</option>
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>검색 입력</label>
            <input
              type='text'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              placeholder='검색어를 입력하세요'
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
      <section>
        <h2 className='text-lg font-semibold mb-4'>| 조회 결과</h2>
        {isLoading ? (
          <div className='text-center'>로딩 중...</div>
        ) : filteredUsers.length > 0 ? (
          <table className='table-auto w-full border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>회원번호</th>
                <th className='border px-4 py-2'>회원명</th>
                <th className='border px-4 py-2'>이메일</th>
                <th className='border px-4 py-2'>전화번호</th>
                <th className='border px-4 py-2'>회원 등급</th>
                <th className='border px-4 py-2'>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userNo}>
                  <td className='border px-4 py-2 text-center'>{user.userNo}</td>
                  <td className='border px-4 py-2'>{user.name}</td>
                  <td className='border px-4 py-2'>{user.email}</td>
                  <td className='border px-4 py-2'>{user.phoneNumber}</td>
                  <td className='border px-4 py-2 text-center'>{user.level}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => handleNavigateToDetail(user.userNo)}
                      className='bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600'
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className='text-center text-gray-500'>조회 결과가 없습니다.</div>
        )}
      </section>
    </div>
  )
}

export default MemberInfoManagement
