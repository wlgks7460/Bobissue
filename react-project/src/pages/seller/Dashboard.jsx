import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [hasPendingProduct, setHasPendingProduct] = useState(false)

  useEffect(() => {
    const fetchPendingProduct = async () => {
      try {
        const response = await fetch('/products/pending')
        const data = await response.json()
        setHasPendingProduct(data.hasPending)
      } catch (error) {
        console.error('Error fetching pending product status:', error)
      }
    }

    fetchPendingProduct()
  }, [])

  return (
    <div className='mx-auto p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>대시보드</h1>

      {/* 상단 기능 메뉴 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6'>
        {[
          {
            title: '상품 관리',
            description: '등록된 상품을 확인하고 관리하세요.',
            link: 'products/search',
            color: 'bg-amber-500',
          },
          {
            title: '주문 관리',
            description: '진행 중인 주문을 확인하세요.',
            link: 'delivery/orders',
            color: 'bg-green-500',
          },
          {
            title: '판매 통계',
            description: '판매 데이터를 확인하세요.',
            link: 'stats/performance',
            color: 'bg-lime-500',
          },
        ].map((item, index) => (
          <div
            key={index}
            className='bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl border border-gray-300 flex flex-col justify-between h-full'
          >
            <h3 className='text-lg font-semibold'>{item.title}</h3>
            <p className='text-sm text-gray-600'>{item.description}</p>
            <Link to={item.link} className='mt-4'>
              <button
                className={`${item.color} text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition`}
              >
                {item.title} 보기
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* 상품 등록 및 라이브 신청 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6'>
        <div className='bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl border border-gray-300 flex flex-col justify-between h-full'>
          <h3 className='text-lg font-semibold'>
            {hasPendingProduct ? '이어서 상품 등록하기' : '새로운 상품을 등록하세요'}
          </h3>
          <Link to='products/register' className='mt-4'>
            <button className='bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition'>
              {hasPendingProduct ? '이어서 등록하기' : '상품 등록하기'}
            </button>
          </Link>
        </div>

        <div className='bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl border border-gray-300 flex flex-col justify-between h-full'>
          <h3 className='text-lg font-semibold'>라이브 커머스를 신청하세요</h3>
          <Link to='lives/apply' className='mt-4'>
            <button className='bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition'>
              라이브 신청하기
            </button>
          </Link>
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {[
          {
            title: '공지사항',
            description: '새로운 업데이트 및 판매자 공지를 확인하세요.',
            link: 'notices',
          },
          {
            title: '고객 문의',
            description: '고객의 질문과 요청을 확인하세요.',
            link: 'inquiries/list',
          },
          {
            title: '정산 관리',
            description: '정산 내역을 확인하고 관리하세요.',
            link: 'settlement/overview',
          },
        ].map((item, index) => (
          <div
            key={index}
            className='bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl border border-gray-300 flex flex-col justify-between h-full'
          >
            <h3 className='text-lg font-semibold'>{item.title}</h3>
            <p className='text-sm text-gray-600'>{item.description}</p>
            <Link to={item.link} className='mt-4'>
              <button className='bg-amber-400 text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition'>
                {item.title} 보기
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
