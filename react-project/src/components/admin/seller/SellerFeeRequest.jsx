import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import ExcelJS from 'exceljs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'

const SellerFeeRequestPage = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '판매자 수수료' }, // 판매자 수수료
    { name: '수수료 정산 요청' }, // 현재 페이지
  ]

  // 예제 데이터
  const [feeRequests, setFeeRequests] = useState([
    { id: 1, name: '가맹점몰', username: 'submall', amount: '300,000원', status: '대기' },
    { id: 2, name: '한글몰', username: 'testmall', amount: '150,000원', status: '대기' },
  ])

  // 대기 상태의 요청 건수 계산
  const pendingCount = feeRequests.filter((request) => request.status === '대기').length

  // 정산 완료된 요청 목록
  const approvedRequests = feeRequests.filter((request) => request.status === '완료')

  // 상태 변경 핸들러
  const handleStatusChange = (id) => {
    setFeeRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === id ? { ...request, status: '완료' } : request)),
    )
  }

  // 엑셀 다운로드 핸들러
  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('정산 완료 목록')

    // 컬럼 정의
    worksheet.columns = [
      { header: '번호', key: 'id', width: 10 },
      { header: '회원명', key: 'name', width: 20 },
      { header: '아이디', key: 'username', width: 20 },
      { header: '정산 금액', key: 'amount', width: 15 },
      { header: '상태', key: 'status', width: 10 },
    ]

    // 승인된 요청 데이터 추가
    approvedRequests.forEach((request) => worksheet.addRow(request))

    // 엑셀 다운로드
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '정산_완료_목록.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
    })
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>수수료 정산 요청</h1>

      {/* 기본 검색 */}
      <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>
      <div className='flex flex-col space-y-4 mb-6'>
        <div className='flex space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>검색어</label>
            <select className='border rounded-md px-3 py-2'>
              <option>아이디</option>
              <option>회원명</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>검색 입력</label>
            <input
              type='text'
              className='border rounded-md px-3 py-2 w-full'
              placeholder='검색어를 입력하세요'
            />
          </div>
        </div>
        <div className='flex space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>기간 검색</label>
            <select className='border rounded-md px-3 py-2'>
              <option>신청일</option>
              <option>승인일</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>시작 날짜</label>
            <input type='date' className='border rounded-md px-3 py-2' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>종료 날짜</label>
            <input type='date' className='border rounded-md px-3 py-2' />
          </div>
        </div>
      </div>
      <div className='flex space-x-2'>
        <button className='bg-black text-white px-4 py-2 rounded'>검색</button>
        <button className='bg-gray-300 text-black px-4 py-2 rounded'>초기화</button>
      </div>

      {/* 수수료 정산 요청 건 */}
      <div className='flex items-center justify-between mt-8 mb-4'>
        <h2 className='text-lg font-semibold'>수수료 정산 요청</h2>
        <span className='text-sm text-gray-500'>{`요청 대기 건: 총 ${pendingCount}건`}</span>
      </div>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>회원명</th>
            <th className='border px-4 py-2'>아이디</th>
            <th className='border px-4 py-2'>정산 금액</th>
            <th className='border px-4 py-2'>상태</th>
            <th className='border px-4 py-2'>정산</th>
          </tr>
        </thead>
        <tbody>
          {feeRequests.map((request) => (
            <tr key={request.id}>
              <td className='border px-4 py-2 text-center'>{request.id}</td>
              <td className='border px-4 py-2'>{request.name}</td>
              <td className='border px-4 py-2'>{request.username}</td>
              <td className='border px-4 py-2 text-center'>{request.amount}</td>
              <td className='border px-4 py-2 text-center'>{request.status}</td>
              <td className='border px-4 py-2 text-center'>
                {request.status === '대기' ? (
                  <button
                    onClick={() => handleStatusChange(request.id)}
                    className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600'
                  >
                    정산하기
                  </button>
                ) : (
                  <span className='text-gray-500'>완료됨</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 엑셀 다운로드 버튼 */}
      <div className='mt-8'>
        <button
          onClick={downloadExcel}
          className='bg-transparent border border-gray-500 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2'
        >
          <FontAwesomeIcon icon={faFileExcel} className='text-green-500' />
          <span>엑셀 다운로드</span>
        </button>
      </div>
    </div>
  )
}

export default SellerFeeRequestPage
