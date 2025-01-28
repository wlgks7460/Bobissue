import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MemberInfoManagement = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원정보관리' }]
  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchType, setSearchType] = useState('user-no')
  const [level, setLevel] = useState('전체')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      if (!searchKeyword) {
        const response = await API.get('/users')
        setFilteredUsers(response.data.result.data)
      } else if (searchType === 'user-no') {
        const response = await API.get(`/users/${searchKeyword}`)
        setFilteredUsers([response.data.result])
      } else {
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
    navigate(`/admin/members/${userNo}`)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h1 className='text-2xl font-bold mb-6'>회원정보관리</h1>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2 w-full'>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='user-no'>회원번호</option>
              <option value='회원명'>회원명</option>
              <option value='이메일'>이메일</option>
            </select>
            <input
              type='text'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className='w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              placeholder='검색어를 입력하세요'
            />
            <button
              onClick={handleSearch}
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 whitespace-nowrap'
            >
              조회
            </button>
          </div>
        </div>
      </section>

      {/* 조회 결과 */}
      <section>
        {/* 조회 결과가 있을 때만 제목 표시 */}
        {filteredUsers.length > 0 && <h2 className='text-lg font-semibold mb-4'>| 조회 결과</h2>}
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
          !isLoading && filteredUsers.length === 0 && <div></div>
        )}
      </section>
    </div>
  )
}

export default MemberInfoManagement
