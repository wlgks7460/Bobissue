import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const SellerListTable = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '판매자관리' }, // 회원관리
    { name: '판매자 전체목록' },
  ]
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 전체 목록</h1>

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
            <label className='block text-sm font-medium mb-1'>만료일</label>
            <div className='flex space-x-2'>
              <input type='date' className='border rounded-md px-3 py-2' />
              <span>~</span>
              <input type='date' className='border rounded-md px-3 py-2' />
            </div>
          </div>
        </div>
      </div>
      <div className='flex space-x-2'>
        <button className='bg-black text-white px-4 py-2 rounded'>검색</button>
        <button className='bg-gray-300 text-black px-4 py-2 rounded'>초기화</button>
      </div>

      {/* 조회 결과 */}
      <h2 className='text-lg font-semibold mt-8 mb-4'>조회 결과</h2>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>회원명</th>
            <th className='border px-4 py-2'>아이디</th>
            <th className='border px-4 py-2'>등록일</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='border px-4 py-2 text-center'>1</td>
            <td className='border px-4 py-2'>가맹점몰</td>
            <td className='border px-4 py-2'>submall</td>
            <td className='border px-4 py-2 text-center'>2025-01-23</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SellerListTable
