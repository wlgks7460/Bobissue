import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import { Search } from 'lucide-react'

const MemberInfoManagement = () => {
  // Breadcrumb 경로 설정
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원정보관리' }]
  const navigate = useNavigate()

  // 검색 관련 상태
  const [searchKeyword, setSearchKeyword] = useState('') // 검색어
  const [searchType, setSearchType] = useState('user-no') // 검색 유형(회원번호, 이름, 이메일)

  // 사용자 목록 관련 상태
  const [allUsers, setAllUsers] = useState([]) // 전체 사용자 리스트
  const [visibleUsers, setVisibleUsers] = useState([]) // 화면에 보여지는 사용자 리스트
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지

  const itemsPerPage = 10 // 페이지당 사용자 수

  // 페이지 로드 시 사용자 목록 가져오기 및 스크롤 이벤트 등록
  useEffect(() => {
    fetchUsers() // 사용자 정보 불러오기
    window.addEventListener('scroll', handleScroll) // 무한 스크롤 이벤트 등록
    return () => window.removeEventListener('scroll', handleScroll) // 이벤트 해제
  }, [])

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    setIsLoading(true) // 로딩 시작
    try {
      const response = await API.get('/users') // 사용자 정보 API 호출
      setAllUsers(response.data.result.data) // 서버로부터 받은 사용자 데이터
      setVisibleUsers(response.data.result.data.slice(0, itemsPerPage)) // 첫 페이지 데이터만 표시
    } catch (error) {
      alert('회원 조회에 실패했습니다.')
    } finally {
      setIsLoading(false) // 로딩 종료
    }
  }

  // 무한 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      loadMoreData() // 추가 데이터 로딩
    }
  }

  // 추가 데이터 로드 (무한 스크롤)
  const loadMoreData = () => {
    if (visibleUsers.length >= allUsers.length) return // 이미 모든 데이터를 불러왔으면 중단

    setIsLoading(true) // 로딩 시작
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = nextPage * itemsPerPage - itemsPerPage
      const endIndex = nextPage * itemsPerPage
      const nextUsers = allUsers.slice(startIndex, endIndex)

      setVisibleUsers((prev) => [...prev, ...nextUsers]) // 기존 데이터에 추가
      setCurrentPage(nextPage) // 현재 페이지 업데이트
      setIsLoading(false) // 로딩 종료
    }, 500)
  }

  // 검색 기능 구현
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력하세요.')
      return
    }

    // 검색 조건에 따라 필터링
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
    setVisibleUsers(filtered) // 검색 결과를 화면에 표시
    setCurrentPage(1)
  }

  // Enter 키로 검색 가능하게 설정
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') handleSearch() // Enter 키 입력 시 검색 실행
  }

  // 상세 페이지로 이동
  const handleNavigateToDetail = (userNo) => {
    navigate(`/admin/members/${userNo}`) // 해당 회원의 상세 페이지로 이동
  }

  // 회원 상태 변경 (활성/비활성)
  const handleToggleStatus = async (userNo, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Y' ? 'N' : 'Y'
      const response = await API.put(`/admin/${userNo}/user-status`, { status: newStatus })
      if (response.data.status === 'ACCEPTED') {
        // 변경된 상태로 화면 업데이트
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
          {/* 검색 조건 선택 (회원번호, 이름, 이메일) */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className='border border-[#A1887F] rounded-md px-3 py-2'
          >
            <option value='user-no'>회원번호</option>
            <option value='name'>회원명</option>
            <option value='email'>이메일</option>
          </select>
          {/* 검색어 입력창 */}
          <input
            type='text'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
            className='w-64 border border-[#A1887F] rounded-md px-3 py-2'
            placeholder='검색어를 입력하세요'
          />
          {/* 조회 버튼 */}
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
        {/* 사용자 정보 테이블 */}
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

                  {/* 회원 상태 변경 버튼 */}
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

                  {/* 회원 상세 정보 버튼 */}
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
