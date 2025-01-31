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
  const [filteredUsers, setFilteredUsers] = useState(null) // 초기값을 null로 변경하여 "회원 정보가 없습니다" 문구 제거
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await API.get('/users')
      setFilteredUsers(response.data.result.data)
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

  const handleSelectUser = (userNo) => {
    setSelectedUsers(
      (prevSelected) =>
        prevSelected.includes(userNo)
          ? prevSelected.filter((id) => id !== userNo) // 선택 해제
          : [...prevSelected, userNo], // 선택 추가
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]) // 전체 선택 해제
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.userNo)) // 모든 회원 선택
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      alert('삭제할 회원을 선택하세요.')
      return
    }
    if (!window.confirm(`선택한 ${selectedUsers.length}명의 회원을 삭제하시겠습니까?`)) return

    try {
      for (const userNo of selectedUsers) {
        await API.delete(`/users/${userNo}`)
      }
      alert('선택한 회원이 삭제되었습니다.')
      setFilteredUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.userNo)))
      setSelectedUsers([])
    } catch (error) {
      console.error('회원 삭제 오류:', error)
      alert('회원 삭제에 실패했습니다.')
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
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2 w-full'>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2'
            >
              <option value='user-no'>회원번호</option>
              <option value='회원명'>회원명</option>
              <option value='이메일'>이메일</option>
            </select>
            <input
              type='text'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className='w-64 border border-gray-300 rounded-md px-3 py-2'
              placeholder='검색어를 입력하세요'
            />
            <button onClick={handleSearch} className='bg-blue-500 text-white px-4 py-2 rounded-md'>
              조회
            </button>
          </div>
        </div>
      </section>

      {/* 조회 결과가 있을 때만 선택 삭제 버튼 표시 */}
      {filteredUsers && filteredUsers.length > 0 && (
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>| 조회 결과</h2>
          <button
            onClick={handleDeleteSelected}
            className='bg-red-500 text-white px-4 py-2 rounded-md'
          >
            선택 삭제
          </button>
        </div>
      )}

      {/* 조회 결과 */}
      <section>
        {isLoading ? (
          <div className='text-center'>로딩 중...</div>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <table className='table-auto w-full border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>
                  <input
                    type='checkbox'
                    checked={selectedUsers.length === filteredUsers.length}
                    onChange={handleSelectAll}
                  />
                </th>
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
                  <td className='border px-4 py-2 text-center'>
                    <input
                      type='checkbox'
                      checked={selectedUsers.includes(user.userNo)}
                      onChange={() => handleSelectUser(user.userNo)}
                    />
                  </td>
                  <td className='border px-4 py-2 text-center'>{user.userNo}</td>
                  <td className='border px-4 py-2'>{user.name}</td>
                  <td className='border px-4 py-2'>{user.email}</td>
                  <td className='border px-4 py-2'>{user.phoneNumber}</td>
                  <td className='border px-4 py-2 text-center'>{user.level}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => handleNavigateToDetail(user.userNo)}
                      className='bg-blue-500 text-white px-2 py-1 rounded-md'
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !isLoading &&
          filteredUsers !== null &&
          filteredUsers.length === 0 && (
            <div className='text-center text-gray-500'>회원 정보가 없습니다.</div>
          )
        )}
      </section>
    </div>
  )
}

export default MemberInfoManagement
