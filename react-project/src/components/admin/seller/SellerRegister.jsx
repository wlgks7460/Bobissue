import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import ExcelJS from 'exceljs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'

const SellerRegister = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '판매자관리' }, // 판매자 관리
    { name: '판매자 신규신청' }, // 현재 페이지
  ]

  // 예제 데이터
  const [newApplications, setNewApplications] = useState([
    { id: 1, name: '가맹점몰', username: 'submall', date: '2025-01-23', status: '대기' },
    { id: 2, name: '한글몰', username: 'testmall', date: '2025-01-24', status: '대기' },
  ])

  // 승인된 판매자 목록
  const [approvedApplications, setApprovedApplications] = useState([])

  // 대기 상태의 신청 건수 계산
  const pendingCount = newApplications.filter((application) => application.status === '대기').length

  // 상태 변경 핸들러
  const handleStatusChange = (id) => {
    setNewApplications((prevApplications) =>
      prevApplications.map((application) => {
        if (application.id === id) {
          const updatedApplication = { ...application, status: '승인' }
          setApprovedApplications((prev) => [...prev, updatedApplication]) // 승인된 목록 추가
          return updatedApplication
        }
        return application
      }),
    )
  }

  // 엑셀 다운로드 핸들러
  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('승인된 판매자 목록')

    // 컬럼 정의
    worksheet.columns = [
      { header: '번호', key: 'id', width: 10 },
      { header: '회원명', key: 'name', width: 20 },
      { header: '아이디', key: 'username', width: 20 },
      { header: '신청일', key: 'date', width: 15 },
      { header: '상태', key: 'status', width: 10 },
    ]

    // 승인된 판매자 목록 추가
    approvedApplications.forEach((application) => worksheet.addRow(application))

    // 엑셀 다운로드
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '승인된_판매자_목록.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
    })
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 신규신청</h1>

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

      {/* 신규 신청 건 */}
      <div className='flex items-center justify-between mt-8 mb-4'>
        <h2 className='text-lg font-semibold'>신규 신청 건</h2>
        <span className='text-sm text-gray-500'>{`총 ${pendingCount}건`}</span>
      </div>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>회원명</th>
            <th className='border px-4 py-2'>아이디</th>
            <th className='border px-4 py-2'>신청일</th>
            <th className='border px-4 py-2'>상태</th>
            <th className='border px-4 py-2'>승인</th>
          </tr>
        </thead>
        <tbody>
          {newApplications.map((application) => (
            <tr key={application.id}>
              <td className='border px-4 py-2 text-center'>{application.id}</td>
              <td className='border px-4 py-2'>{application.name}</td>
              <td className='border px-4 py-2'>{application.username}</td>
              <td className='border px-4 py-2 text-center'>{application.date}</td>
              <td className='border px-4 py-2 text-center'>{application.status}</td>
              <td className='border px-4 py-2 text-center'>
                {application.status === '대기' ? (
                  <button
                    onClick={() => handleStatusChange(application.id)}
                    className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600'
                  >
                    승인
                  </button>
                ) : (
                  <span className='text-gray-500'>승인됨</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 승인된 판매자 목록 */}
      <div className='mt-12'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>승인된 판매자 목록</h2>
          <button
            onClick={downloadExcel}
            className='bg-transparent border border-gray-500 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2'
          >
            <FontAwesomeIcon icon={faFileExcel} className='text-green-500' />
            <span>엑셀 다운로드</span>
          </button>
        </div>
        <table className='table-auto w-full border'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-4 py-2'>번호</th>
              <th className='border px-4 py-2'>회원명</th>
              <th className='border px-4 py-2'>아이디</th>
              <th className='border px-4 py-2'>신청일</th>
              <th className='border px-4 py-2'>상태</th>
            </tr>
          </thead>
          <tbody>
            {approvedApplications.map((application) => (
              <tr key={application.id}>
                <td className='border px-4 py-2 text-center'>{application.id}</td>
                <td className='border px-4 py-2'>{application.name}</td>
                <td className='border px-4 py-2'>{application.username}</td>
                <td className='border px-4 py-2 text-center'>{application.date}</td>
                <td className='border px-4 py-2 text-center'>{application.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerRegister
