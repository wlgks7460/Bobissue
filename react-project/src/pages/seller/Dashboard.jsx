import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaShoppingCart,
  FaBoxOpen,
  FaChartLine,
  FaUsers,
  FaRegHandshake,
  FaQuestionCircle,
} from 'react-icons/fa'

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
    <div className='max-w-6xl mx-auto p-6 bg-gradient-to-r from-yellow-100 to-rose-100 min-h-screen'>
      <h1 className='text-4xl font-bold text-gray-800 mb-8 text-center'>대시보드</h1>

      {/* 📌 2열 레이아웃 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 좌측 섹션 */}
        <div className='space-y-6'>
          <Section title='상품 관리'>
            <DashboardItem
              title='상품 조회 & 관리'
              description='등록된 상품을 확인하고 관리하세요.'
              link='products/search'
              color='bg-blue-500'
              icon={<FaBoxOpen />}
            />
            <DashboardItem
              title='상품 등록'
              description={hasPendingProduct ? '이어서 등록하세요.' : '새로운 상품을 등록하세요.'}
              link='products/register'
              color='bg-green-500'
              icon={<FaShoppingCart />}
            />
          </Section>

          <Section title='라이브 커머스'>
            <DashboardItem
              title='라이브 신청'
              description='라이브 커머스를 신청하세요.'
              link='lives/apply'
              color='bg-orange-500'
              icon={<FaRegHandshake />}
            />
          </Section>
        </div>

        {/* 우측 섹션 */}
        <div className='space-y-6'>
          <Section title='판매 & 주문'>
            <DashboardItem
              title='주문 관리'
              description='진행 중인 주문을 확인하세요.'
              link='delivery/orders'
              color='bg-purple-500'
              icon={<FaShoppingCart />}
            />
            <DashboardItem
              title='판매 통계'
              description='판매 데이터를 확인하세요.'
              link='stats/performance'
              color='bg-teal-500'
              icon={<FaChartLine />}
            />
          </Section>

          <Section title='고객 & 정산'>
            <DashboardItem
              title='고객 문의'
              description='고객의 질문과 요청을 확인하세요.'
              link='inquiries/list'
              color='bg-indigo-500'
              icon={<FaQuestionCircle />}
            />
            <DashboardItem
              title='정산 관리'
              description='정산 내역을 확인하고 관리하세요.'
              link='settlement/overview'
              color='bg-pink-500'
              icon={<FaUsers />}
            />
          </Section>
        </div>
      </div>
    </div>
  )
}

// 📌 공통 섹션 컴포넌트
const Section = ({ title, children }) => (
  <div className='p-4 bg-white rounded-lg shadow-lg'>
    <h2 className='text-2xl font-semibold text-gray-700 border-b-2 pb-3 mb-3'>{title}</h2>
    <div className='space-y-3'>{children}</div>
  </div>
)

// 📌 개별 대시보드 아이템
const DashboardItem = ({ title, description, link, color, icon }) => (
  <Link to={link} className='block'>
    <div
      className={`flex items-center justify-between p-4 rounded-lg text-white ${color} hover:opacity-90 transition`}
    >
      <div className='flex items-center space-x-4'>
        <div className='text-3xl'>{icon}</div>
        <div>
          <h3 className='font-bold text-lg'>{title}</h3>
          <p className='text-sm'>{description}</p>
        </div>
      </div>
      <span className='text-xl'>→</span>
    </div>
  </Link>
)

export default Dashboard
