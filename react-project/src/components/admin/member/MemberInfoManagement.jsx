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

  // 페이지 로드 시 사용자 목록 가져오기 및 스크롤 이벤트 등록
  useEffect(() => {
    fetchUsers()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 사용자 목록 가져오기
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

  // 무한 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      loadMoreData()
    }
  }

  // 추가 데이터 로드 (무한 스크롤)
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

  // 검색 기능 구현
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

  // Enter 키로 검색 가능하게 설정
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') handleSearch()
  }

  // 상세 페이지로 이동
  const handleNavigateToDetail = (userNo) => {
    navigate(`/admin/members/${userNo}`)
  }

  // 회원 상태 변경 (활성/비활성)
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
      <h1 className='text-2xl font-bold mb-6'>회원 정보관리</h1>

      {/* 검색 영역 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>
          🏆 총 회원수: <span className='text-[#6D4C41] font-bold'>{allUsers.length}명 </span>
        </h2>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>
        <div className='flex items-center space-x-4'>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className='border border-[#A1887F] rounded-md px-3 py-2'
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
            className='w-64 border border-[#A1887F] rounded-md px-3 py-2'
            placeholder='검색어를 입력하세요'
          />
          <button
            onClick={handleSearch}
            className='bg-[#6D4C41] hover:bg-[#5D4037] text-white px-4 py-2 rounded-md shadow-md'
          >
            조회
          </button>
        </div>
      </section>

      {/* 조회 결과 영역 */}
      <h2 className='text-lg font-semibold mb-4'>| 조회결과</h2>

      {isLoading && <div className='text-center'>로딩 중...</div>}
      <section>
        {visibleUsers.length > 0 ? (
          <table className='table-auto w-full border border-[#D7CCC8] rounded-md overflow-hidden'>
            <thead>
              <tr className='bg-[#FFF3E0] text-[#3E2723]'>
                <th className='border px-4 py-2'>회원번호</th>
                <th className='border px-4 py-2'>회원명</th>
                <th className='border px-4 py-2'>생년월일</th>
                <th className='border px-4 py-2'>이메일</th>
                <th className='border px-4 py-2'>성별</th>
                <th className='border px-4 py-2'>회원 상태(변경)</th>
                <th className='border px-4 py-2'>상세</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.userNo}>
                  <td className='border px-4 py-2 text-center'>{user.userNo}</td>
                  <td className='border px-4 py-2 text-center'>{user.name}</td>
                  <td className='border px-4 py-2 text-center'>{user.birthday}</td>
                  <td className='border px-4 py-2 text-center'>{user.email}</td>
                  <td className='border px-4 py-2 text-center'>{user.gender}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => {
                        if (window.confirm(`${user.name} 회원의 상태를 변경하시겠습니까?`)) {
                          handleToggleStatus(user.userNo, user.status)
                        }
                      }}
                      className={`px-4 py-2 text-lg font-bold transition duration-300 hover:shadow-md rounded-full ${
                        user.status === 'Y' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {user.status === 'Y' ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => handleNavigateToDetail(user.userNo)}
                      className='text-[#6D4C41] hover:text-[#3E2723]'
                    >
                      <Search size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !isLoading && <div className='text-center text-[#3E2723]'>회원 정보가 없습니다.</div>
        )}
      </section>
    </div>
  )
}

export default MemberInfoManagement
