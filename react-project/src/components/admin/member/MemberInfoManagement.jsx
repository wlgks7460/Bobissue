import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MemberInfoManagement = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원정보관리' }]

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchType, setSearchType] = useState('user-no') // 기본 검색 유형은 회원 번호
  const [level, setLevel] = useState('전체') // 회원 레벨
  const [users, setUsers] = useState([]) // 전체 회원 데이터
  const [filteredUsers, setFilteredUsers] = useState([]) // 필터링된 결과
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태

  // 등급 이름을 관리하는 함수
  const getGradeName = (gradeNo) => {
    switch (gradeNo) {
      case 0:
        return '일반회원'
      default:
        return '기타 등급'
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      if (!searchKeyword) {
        // 키워드가 없으면 전체 조회
        const response = await API.get('/users')
        console.log('전체 회원 데이터:', response.data.result.data) // 전체 데이터 출력

        const data = response.data.result.data
        if (data.length === 0) {
          alert('조회 결과가 없습니다.')
        }
        setFilteredUsers(data) // 전체 데이터 저장
      } else if (searchType === 'user-no') {
        // 특정 회원 조회
        try {
          const response = await API.get(`/users/${searchKeyword}`)

          setFilteredUsers([response.data.result]) // 결과를 배열로 설정
        } catch (error) {
          alert('존재하지 않는 데이터입니다.')
        }
      } else {
        // 검색 키워드가 있을 경우 전체 데이터에서 필터링
        const response = await API.get('/users')
        const filtered = response.data.result.data.filter((user) => {
          const matchesSearch =
            searchType === '회원명'
              ? user.name.includes(searchKeyword) // 회원명 검색
              : searchType === '이메일'
                ? user.email.includes(searchKeyword) // 이메일 검색
                : true

          const matchesLevel = level === '전체' || user.level === level

          return matchesSearch && matchesLevel
        })

        if (filtered.length === 0) {
          alert('존재하지 않는 데이터입니다.') // 필터링 결과가 없을 때 알림
        }
        setFilteredUsers(filtered)
      }
    } catch (error) {
      console.error('회원 조회 중 오류 발생:', error)
      alert('회원 조회에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 엔터 키 입력 처리
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch() // 조회 버튼과 동일한 동작 수행
    }
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h1 className='text-2xl font-bold mb-6'>회원정보관리</h1>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>

        {/* 검색어 */}
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
              onKeyDown={handleKeyDown} // 엔터 키 처리
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              placeholder='검색어를 입력하세요'
            />
          </div>
        </div>

        {/* 레벨 검색 */}
        <div className='mb-4'>
          <h3 className='text-sm font-medium mb-2'>레벨 검색</h3>
          <div className='flex items-center space-x-4'>
            {['전체', '일반회원', '우수회원', '특별회원', '판매자'].map((lvl) => (
              <label key={lvl} className='flex items-center space-x-2'>
                <input
                  type='radio'
                  name='level'
                  value={lvl}
                  checked={level === lvl}
                  onChange={(e) => setLevel(e.target.value)}
                />
                <span>{lvl}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 조회 버튼 */}
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
                <th className='border px-4 py-2'>성별</th>
                <th className='border px-4 py-2'>회원명</th>
                <th className='border px-4 py-2'>생년월일</th>
                <th className='border px-4 py-2'>이메일</th>
                <th className='border px-4 py-2'>전화번호</th>
                <th className='border px-4 py-2'>회원 등급</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userNo}>
                  <td className='border px-4 py-2 text-center'>{user.userNo}</td>
                  <td className='border px-4 py-2 text-center'>
                    {user.gender === 'M' ? '남' : user.gender === 'F' ? '여' : '알 수 없음'}
                  </td>
                  <td className='border px-4 py-2'>{user.name}</td>
                  <td className='border px-4 py-2'>{user.birthday}</td>
                  <td className='border px-4 py-2'>{user.email}</td>
                  <td className='border px-4 py-2'>{user.phoneNumber}</td>
                  <td className='border px-4 py-2 text-center'>{getGradeName(user.gradeNo)}</td>
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
