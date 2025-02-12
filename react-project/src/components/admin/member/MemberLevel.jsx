import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { FaMedal } from 'react-icons/fa' // FontAwesome 아이콘 추가

const MemberLevelManagement = () => {
  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원레벨관리' }]

  // 등급별 스타일 지정 (배경 제거, 테두리 추가)
  const initialLevelData = [
    {
      level: '브론즈',
      upgradeCondition: '가입 시 기본 등급',
      discount: '없음',
      coupon: 'X',
      borderColor: 'border-orange-400',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-500',
    },
    {
      level: '실버',
      upgradeCondition: '월 실적 10만 원 이상',
      discount: '3% ~ 5% 할인',
      coupon: 'O',
      borderColor: 'border-gray-400',
      textColor: 'text-black-400',
      iconColor: 'text-gray-500',
    },
    {
      level: '골드',
      upgradeCondition: '월 실적 30만 원 이상',
      discount: '5,000원 할인 (10만 원 이상 구매 시)',
      coupon: 'O',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-500',
    },
  ]

  // 할인 정책 관리 (입력 가능)
  const [levelData, setLevelData] = useState(initialLevelData)

  const handleDiscountChange = (index, value) => {
    const updatedData = [...levelData]
    updatedData[index].discount = value
    setLevelData(updatedData)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>회원 레벨 관리</h1>

      {/* 정책 설명 */}
      <section className='mb-10'>
        <h2 className='text-lg font-semibold mb-4 text-gray-700'>| 회원 등급 정책</h2>
        <p className='text-gray-600'>
          회원 등급은 <span className='font-bold text-blue-600'>매월 1일 자동 갱신</span>됩니다.
          실적 기준 충족 시 등급이 상향되며, 등급별 혜택이 달라집니다.
        </p>
      </section>

      {/* 회원 등급 카드 디자인 (테두리 스타일 적용) */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {levelData.map((item, index) => (
          <div key={index} className={`rounded-xl border-2 p-6 ${item.borderColor} shadow-sm`}>
            <div className='flex items-center justify-center mb-4'>
              <FaMedal className={`text-3xl ${item.iconColor}`} />
              <h2 className={`text-xl font-bold ml-3 ${item.textColor}`}>{item.level}</h2>
            </div>
            <p className={`text-md mb-2 font-semibold ${item.textColor}`}>
              {item.upgradeCondition}
            </p>
            <div className='mb-3'>
              <span className={`text-md ${item.textColor}`}>할인 혜택: </span>
              <input
                type='text'
                value={item.discount}
                onChange={(e) => handleDiscountChange(index, e.target.value)}
                className='w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
              />
            </div>
            <p className={`text-md ${item.textColor}`}>
              쿠폰 지급: <span className='font-bold'>{item.coupon}</span>
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default MemberLevelManagement
