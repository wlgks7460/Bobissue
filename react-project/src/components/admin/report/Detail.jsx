import Breadcrumb from '../common/Breadcrumb'
import React, { useState } from 'react'

const ReportDetail = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home', link: '/' }, // 홈
    { name: '컨텐츠관리', link: '/content' },
    { name: '신고관리', link: '/report-management' },
    { name: '신고내역조회' },
  ]

  // 신고 데이터 (샘플 데이터)
  const allReports = [
    {
      id: 1,
      category: '욕설',
      content: '부적절한 채팅 메시지 발견',
      target: '김철수',
      member: '홍길동',
      status: '대기',
      reportedContent: '채팅 내용: "부적절한 욕설"',
    },
    {
      id: 2,
      category: '허위 정보',
      content: '잘못된 상품 정보 제공',
      target: '박영희',
      member: '이영수',
      status: '정지',
      reportedContent: '상품 설명: "잘못된 정보"',
    },
    {
      id: 3,
      category: '스팸',
      content: '광고 메시지 다수 발송',
      target: '정다은',
      member: '최민호',
      status: '허위 신고',
      reportedContent: '채팅 내용: "스팸 광고 메시지"',
    },
  ]

  // 상태 관리
  const [searchType, setSearchType] = useState('category') // 검색 유형 (category or member)
  const [searchValue, setSearchValue] = useState('') // 검색 값
  const [results, setResults] = useState([])
  const [decision, setDecision] = useState('') // 처분 결정

  // 검색 버튼 핸들러
  const handleSearch = () => {
    let filteredReports = []
    if (searchType === 'category') {
      filteredReports = allReports.filter((report) => report.category.includes(searchValue))
    } else if (searchType === 'member') {
      filteredReports = allReports.filter((report) => report.member.includes(searchValue))
    }
    setResults(filteredReports)
  }

  // 처분 버튼 핸들러
  const handleDecision = () => {
    if (!decision) {
      alert('처분 내용을 선택해주세요.')
      return
    }
    alert(`선택된 신고에 대한 처분: ${decision}`)
    // 추가 로직: API 호출, 상태 업데이트 등
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>신고상세 조회 및 처리</h1>

      {/* 검색 조건 */}
      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 신고 조건 조회</h2>
        <div className='flex items-center space-x-4'>
          {/* 검색 유형 선택 */}
          <select
            className='border border-gray-300 rounded px-3 py-2'
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value='category'>신고 카테고리</option>
            <option value='member'>신고 회원</option>
          </select>
          {/* 검색 입력 필드 */}
          <input
            type='text'
            placeholder={
              searchType === 'category' ? '신고 카테고리를 입력하세요' : '신고 회원을 입력하세요'
            }
            className='border border-gray-300 rounded px-3 py-2 w-1/2'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            조회하기
          </button>
        </div>
      </div>

      {/* 조회 결과 */}
      <h2 className='text-lg font-semibold mb-4'>| 신고목록</h2>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>신고 ID</th>
            <th className='border px-4 py-2'>신고 카테고리</th>
            <th className='border px-4 py-2'>신고 내용</th>
            <th className='border px-4 py-2'>신고 대상</th>
            <th className='border px-4 py-2'>신고 회원</th>
            <th className='border px-4 py-2'>처리 상태</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((report) => (
              <tr key={report.id}>
                <td className='border px-4 py-2 text-center'>{report.id}</td>
                <td className='border px-4 py-2 text-center'>{report.category}</td>
                <td className='border px-4 py-2'>{report.content}</td>
                <td className='border px-4 py-2 text-center'>{report.target}</td>
                <td className='border px-4 py-2 text-center'>{report.member}</td>
                <td className='border px-4 py-2 text-center'>{report.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6' className='border px-4 py-2 text-center'>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 처분 결정 */}
      <h2 className='text-lg font-semibold mt-6 mb-4'>| 처분 결정</h2>
      <div>
        <label className='block text-sm font-medium mb-2'>처분 선택</label>
        <select
          className='border border-gray-300 rounded px-3 py-2 w-1/2'
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        >
          <option value=''>처분을 선택하세요</option>
          <option value='정지'>정지</option>
          <option value='탈퇴'>탈퇴</option>
          <option value='허위 신고'>허위 신고</option>
        </select>
        <button
          onClick={handleDecision}
          className='ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          처분 적용
        </button>
      </div>
    </div>
  )
}

export default ReportDetail
