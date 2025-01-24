import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import ExcelJS from 'exceljs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
const SellerFeeInfo = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '판매자 수수료' }, // 판매자 수수료
    { name: '판매자 수수료내역' }, // 현재 페이지
  ]

  // 예제 데이터
  const feeData = [
    { date: '2025-01-15', id: 'seller01', name: '홍길동', amount: '300,000원', status: '완료' },
    { date: '2025-01-20', id: 'seller02', name: '김철수', amount: '150,000원', status: '미정산' },
  ]

  // 엑셀 다운로드 핸들러
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('판매자 수수료내역')

    // 컬럼 정의
    worksheet.columns = [
      { header: '정산일', key: 'date', width: 15 },
      { header: '아이디', key: 'id', width: 20 },
      { header: '회원명', key: 'name', width: 20 },
      { header: '수수료 금액', key: 'amount', width: 15 },
      { header: '상태', key: 'status', width: 10 },
    ]

    // 데이터 추가
    feeData.forEach((row) => {
      worksheet.addRow(row)
    })

    // 엑셀 파일 다운로드
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '판매자_수수료내역.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 수수료내역</h1>

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
              <option>정산일</option>
              <option>수수료 발생일</option>
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

      {/* 조회 결과 */}
      <div className='flex justify-between items-center mt-8 mb-4'>
        <h2 className='text-lg font-semibold'>조회 결과</h2>
        <button
          onClick={handleDownloadExcel} // 다운로드 핸들러 연결
          className='bg-transparent border border-gray-500 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2'
        >
          <FontAwesomeIcon icon={faFileExcel} className='text-green-500' />
          <span>엑셀 다운로드</span>
        </button>
      </div>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>정산일</th>
            <th className='border px-4 py-2'>아이디</th>
            <th className='border px-4 py-2'>회원명</th>
            <th className='border px-4 py-2'>수수료 금액</th>
            <th className='border px-4 py-2'>상태</th>
          </tr>
        </thead>
        <tbody>
          {feeData.map((row, index) => (
            <tr key={index}>
              <td className='border px-4 py-2 text-center'>{row.date}</td>
              <td className='border px-4 py-2 text-center'>{row.id}</td>
              <td className='border px-4 py-2 text-center'>{row.name}</td>
              <td className='border px-4 py-2 text-center'>{row.amount}</td>
              <td className='border px-4 py-2 text-center'>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SellerFeeInfo
