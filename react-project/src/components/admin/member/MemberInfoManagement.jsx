import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import { Search } from 'lucide-react'

const MemberInfoManagement = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원정보관리' }]
  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchType, setSearchType] = useState('user-no')
  const [allUsers, setAllUsers] = useState([])
  const [visibleUsers, setVisibleUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchUsers()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await API.get('/users')
      setAllUsers(response.data.result.data)
      setVisibleUsers(response.data.result.data.slice(0, itemsPerPage))
    } catch (error) {
      alert('회원 조회에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      loadMoreData()
    }
  }

  const loadMoreData = () => {
    if (visibleUsers.length >= allUsers.length) return
    setIsLoading(true)
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = nextPage * itemsPerPage - itemsPerPage
      const endIndex = nextPage * itemsPerPage
      const nextUsers = allUsers.slice(startIndex, endIndex)

      setVisibleUsers((prev) => [...prev, ...nextUsers])
      setCurrentPage(nextPage)
      setIsLoading(false)
    }, 500)
  }

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력하세요.')
      return
    }
    const filtered = allUsers.filter((user) => {
      if (searchType === 'user-no') {
        return user.userNo.toString() === searchKeyword
      } else if (searchType === 'name') {
        return user.name === searchKeyword
      } else if (searchType === 'email') {
        return user.email === searchKeyword
      }
      return false
    })
    setVisibleUsers(filtered)
    setCurrentPage(1)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') handleSearch()
  }

  const handleNavigateToDetail = (userNo) => {
    navigate(`/admin/members/${userNo}`)
  }

  const handleToggleStatus = async (userNo, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Y' ? 'N' : 'Y'
      const response = await API.put(`/admin/${userNo}/user-status`, { status: newStatus })
      if (response.data.status === 'ACCEPTED') {
        setVisibleUsers((users) =>
          users.map((user) => (user.userNo === userNo ? { ...user, status: newStatus } : user)),
        )
        alert(newStatus === 'Y' ? '회원이 활성화되었습니다.' : '회원이 비활성화되었습니다.')
      } else {
        alert('상태 변경에 실패했습니다.')
      }
    } catch (error) {
      alert('상태 변경에 실패했습니다.')
    }
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원정보관리</h1>
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>
          🏆 총 회원수: <span className='text-blue-500 font-bold'>{allUsers.length}명 </span>
        </h2>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>
        <div className='flex items-center space-x-4'>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2'
          >
            <option value='user-no'>회원번호</option>
            <option value='name'>회원명</option>
            <option value='email'>이메일</option>
          </select>
          <input
            type='text'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
            className='w-64 border border-gray-300 rounded-md px-3 py-2'
            placeholder='검색어를 입력하세요'
          />
          <button
            onClick={handleSearch}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
          >
            조회
          </button>
        </div>
      </section>
      <h2 className='text-lg font-semibold mb-4'>| 조회결과</h2>

      {isLoading && <div className='text-center'>로딩 중...</div>}
      <section>
        {visibleUsers.length > 0 ? (
          <table className='table-auto w-full border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>회원번호</th>
                <th className='border px-4 py-2'>회원명</th>
                <th className='border px-4 py-2'>생년월일</th>
                <th className='border px-4 py-2'>이메일</th>
                <th className='border px-4 py-2'>성별</th>
                <th className='border px-4 py-2'>회원 상태</th>
                <th className='border px-4 py-2'>상세</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.userNo} className='hover:bg-gray-50'>
                  <td className='border px-4 py-2 text-center'>{user.userNo}</td>
                  <td className='border px-4 py-2 text-center'>{user.name}</td>
                  <td className='border px-4 py-2 text-center'>{user.birthday}</td>
                  <td className='border px-4 py-2 text-center'>{user.email}</td>
                  <td className='border px-4 py-2 text-center'>{user.gender}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => handleToggleStatus(user.userNo, user.status)}
                      className={`px-4 py-2 rounded-md ${
                        user.status === 'Y' ? 'bg-green-500' : 'bg-gray-500'
                      } text-white`}
                    >
                      {user.status === 'Y' ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => handleNavigateToDetail(user.userNo)}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      <Search size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !isLoading && <div className='text-center text-gray-500'>회원 정보가 없습니다.</div>
        )}
      </section>
    </div>
  )
}

export default MemberInfoManagement
