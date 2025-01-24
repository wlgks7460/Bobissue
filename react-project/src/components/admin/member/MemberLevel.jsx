import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const MemberLevelManagement = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '회원관리' }, // 회원관리
    { name: '회원관리' }, // 회원관리
    { name: '회원레벨관리' }, // 현재 페이지
  ]

  const levelData = [
    { level: 'LV 8', name: '일반회원' },
    { level: 'LV 7', name: '우수회원' },
    { level: 'LV 6', name: '특별회원' },
    { level: 'LV 5', name: '판매자' },
    { level: 'LV 4', name: '' },
    { level: 'LV 3', name: '' },
    { level: 'LV 2', name: '' },
    { level: 'LV 1', name: '관리자' },
  ]

  const [discountRates, setDiscountRates] = useState(Array(levelData.length).fill(''))

  const handleDiscountChange = (index, value) => {
    const numericValue = value.replace('%', '').trim()
    if (isNaN(numericValue)) return
    const updatedRates = [...discountRates]
    updatedRates[index] = numericValue
    setDiscountRates(updatedRates)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원레벨관리</h1>

      {/* 세부 설정 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 세부설정</h2>

        {/* 레벨 관리 테이블 */}
        <table className='w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 p-2'>레벨</th>
              <th className='border border-gray-300 p-2'>레벨명</th>
              <th className='border border-gray-300 p-2'>할인율</th>
              <th className='border border-gray-300 p-2'>비고</th>
            </tr>
          </thead>
          <tbody>
            {levelData.map((item, index) => (
              <tr
                key={index}
                className={`text-center ${
                  index >= 3 && index <= 6 ? 'bg-gray-100' : '' // 레벨 2~5만 색상 적용
                }`}
              >
                <td className='border border-gray-300 p-2'>{item.level}</td>
                <td className='border border-gray-300 p-2'>
                  <input
                    type='text'
                    defaultValue={item.name}
                    className='w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500'
                  />
                </td>
                <td className='border border-gray-300 p-2'>
                  <input
                    type='text'
                    value={discountRates[index] ? `${discountRates[index]}%` : ''}
                    onChange={(e) => handleDiscountChange(index, e.target.value)}
                    className='w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500'
                  />
                </td>
                <td className='border border-gray-300 p-2'>
                  <input
                    type='text'
                    className='w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 저장 버튼 */}
      <div className='text-center'>
        <button className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600'>
          저장
        </button>
      </div>
    </div>
  )
}

export default MemberLevelManagement
