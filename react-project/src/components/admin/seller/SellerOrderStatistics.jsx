import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import ExcelJS from 'exceljs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'

const SellerOrderStatistics = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자 관리' }, { name: '가맹점 주문통계' }]

  // 예제 데이터
  const orderData = [
    {
      id: 1,
      name: '가맹점몰',
      username: 'submall',
      orderAmount: 615600,
      today: 0,
      lastWeek: 0,
      lastMonth: 615600,
      threeMonths: 615600,
    },
    {
      id: 2,
      name: '한글몰',
      username: 'test1',
      orderAmount: 0,
      today: 0,
      lastWeek: 0,
      lastMonth: 0,
      threeMonths: 0,
    },
  ]

  // 엑셀 다운로드 핸들러
  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('가맹점 주문통계')

    worksheet.columns = [
      { header: '번호', key: 'id', width: 10 },
      { header: '회원명', key: 'name', width: 20 },
      { header: '아이디', key: 'username', width: 20 },
      { header: '총 주문액', key: 'orderAmount', width: 15 },
      { header: '오늘', key: 'today', width: 10 },
      { header: '지난주', key: 'lastWeek', width: 10 },
      { header: '지난달', key: 'lastMonth', width: 10 },
      { header: '3개월', key: 'threeMonths', width: 10 },
    ]

    orderData.forEach((order) => worksheet.addRow(order))

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '가맹점_주문통계.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>가맹점 주문통계</h1>

      {/* 기본 검색 */}
      <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>
      <div className='mb-6'>
        <div className='flex space-x-4 mb-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>검색어</label>
            <select className='border rounded-md px-3 py-2'>
              <option>아이디</option>
              <option>회원명</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>주문일</label>
            <div className='flex space-x-2'>
              <input type='date' className='border rounded-md px-3 py-2' />
              <span className='text-gray-500'>~</span>
              <input type='date' className='border rounded-md px-3 py-2' />
            </div>
          </div>
        </div>
        <div className='flex space-x-2'>
          <button className='bg-black text-white px-4 py-2 rounded'>검색</button>
          <button className='bg-gray-300 text-black px-4 py-2 rounded'>초기화</button>
        </div>
      </div>

      {/* 통계 결과 */}
      <div className='flex justify-between items-center mb-4'>
        <span className='text-sm text-gray-500'>
          총 주문액: <span className='text-red-500 font-bold'>615,600원</span>, 총 판매상품수: 1건
        </span>
        <button
          onClick={downloadExcel}
          className='bg-transparent border border-gray-500 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2'
        >
          <FontAwesomeIcon icon={faFileExcel} className='text-green-500' />
          <span>엑셀 저장</span>
        </button>
      </div>

      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>회원명</th>
            <th className='border px-4 py-2'>아이디</th>
            <th className='border px-4 py-2'>총 주문액</th>
            <th className='border px-4 py-2'>오늘</th>
            <th className='border px-4 py-2'>지난주</th>
            <th className='border px-4 py-2'>지난달</th>
            <th className='border px-4 py-2'>3개월</th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((row) => (
            <tr key={row.id}>
              <td className='border px-4 py-2 text-center'>{row.id}</td>
              <td className='border px-4 py-2 text-center'>{row.name}</td>
              <td className='border px-4 py-2 text-center'>{row.username}</td>
              <td className='border px-4 py-2 text-center'>{row.orderAmount.toLocaleString()}원</td>
              <td className='border px-4 py-2 text-center'>{row.today.toLocaleString()}원</td>
              <td className='border px-4 py-2 text-center'>{row.lastWeek.toLocaleString()}원</td>
              <td className='border px-4 py-2 text-center'>{row.lastMonth.toLocaleString()}원</td>
              <td className='border px-4 py-2 text-center'>{row.threeMonths.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SellerOrderStatistics
