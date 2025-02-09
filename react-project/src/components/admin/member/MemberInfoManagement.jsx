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
  const [allUsers, setAllUsers] = useState([]) // 원본 데이터
  const [visibleUsers, setVisibleUsers] = useState([]) // 화면에 표시할 데이터
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
  const itemsPerPage = 10 // 한 번에 가져올 데이터 수

  useEffect(() => {
    console.log('🔍 useEffect 실행됨, 현재 경로:', window.location.pathname)
    if (window.location.pathname === '/users') {
      console.warn('🚨 예상치 못한 /users 이동 발생!')
    }
    fetchUsers()

    return () => {
      console.log('🛑 useEffect Cleanup 실행됨')
    }
  }, [])

  useEffect(() => {
    // 무한 스크롤 이벤트 등록
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleUsers, currentPage, allUsers])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await API.get('/users')
      console.log('📋 전체 회원 데이터 로드 완료:', response.data.result.data)

      setAllUsers(response.data.result.data) // 원본 데이터 저장
      setVisibleUsers(response.data.result.data.slice(0, itemsPerPage)) // 첫 페이지 데이터 표시
    } catch (error) {
      console.error('❌ 회원 조회 중 오류 발생:', error)
      alert('회원 조회에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 && // 페이지 하단 근처
      !isLoading // 로딩 중이 아닐 때만
    ) {
      loadMoreData()
    }
  }

  const loadMoreData = () => {
    if (visibleUsers.length >= allUsers.length) return // 더 이상 로드할 데이터가 없을 때 종료

    setIsLoading(true)
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = nextPage * itemsPerPage - itemsPerPage
      const endIndex = nextPage * itemsPerPage
      const nextUsers = allUsers.slice(startIndex, endIndex)

      setVisibleUsers((prev) => [...prev, ...nextUsers]) // 기존 데이터에 추가
      setCurrentPage(nextPage) // 페이지 번호 증가
      setIsLoading(false)
    }, 500) // 로딩 딜레이 (모의 서버 요청)
  }

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력하세요.')
      return
    }

    const filtered = allUsers.filter((user) => {
      if (searchType === 'user-no') {
        return user.userNo.toString() === searchKeyword // 정확히 일치
      } else if (searchType === 'name') {
        return user.name === searchKeyword // 정확히 일치
      } else if (searchType === 'email') {
        return user.email === searchKeyword // 정확히 일치
      }
      return false
    })

    console.log('🔍 검색 결과:', filtered)

    setVisibleUsers(filtered) // 검색된 데이터만 화면에 표시
    setCurrentPage(1) // 페이지 번호 초기화
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleNavigateToDetail = (userNo) => {
    console.log('📂 상세 페이지로 이동:', userNo)
    navigate(`/admin/members/${userNo}`)
  }

  const handleToggleStatus = async (userNo, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE'
      const response = await API.put(`/admin/${userNo}/user-status`, {
        status: newStatus,
      })

      console.log('🔄 상태 변경 응답:', response.data)

      if (response.data.status === 'ACCEPTED') {
        setVisibleUsers((users) =>
          users.map((user) =>
            user.userNo === userNo ? { ...user, status: response.data.result } : user,
          ),
        )
        const alertMessage =
          response.data.result === 'ACTIVE'
            ? '회원이 활성화되었습니다.'
            : '회원이 비활성화되었습니다.'
        alert(alertMessage)
      } else {
        alert('상태 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('❌ 사용자 상태 변경 중 오류 발생:', error)
      alert('상태 변경에 실패했습니다. 다시 시도해주세요.')
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
          <div className='flex items-center space-x-2 w-full'>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='user-no'>회원번호</option>
              <option value='name'>회원명</option>
              <option value='email'>이메일</option>
            </select>
            <input
              type='text'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyPress} // 엔터 키 감지
              className='w-64 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='검색어를 입력하세요'
            />
            <button
              onClick={handleSearch}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              조회
            </button>
          </div>
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
                <th className='border px-4 py-2'>이메일</th>
                <th className='border px-4 py-2'>회원 상태</th>
                <th className='border px-4 py-2'>상세</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.userNo} className='hover:bg-gray-50'>
                  <td className='border px-4 py-2 text-center'>{user.userNo}</td>
                  <td className='border px-4 py-2 text-center'>{user.name}</td>
                  <td className='border px-4 py-2 text-center'>{user.email}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => handleToggleStatus(user.userNo, user.status)}
                      className={`px-4 py-2 rounded-md ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => handleNavigateToDetail(user.userNo)}
                      className='bg-transparent text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50'
                    >
                      <Search size={20} strokeWidth={2} />
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
