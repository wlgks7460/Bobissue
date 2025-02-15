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
    <div className='max-w-7xl mx-auto px-10 py-12 bg-white min-h-screen'>
      {/* 헤더 */}
      <header className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold text-brown-800'>📦 상품 관리, 쉽고 간편하게!</h1>
        <p className='text-lg text-brown-600 mt-3'>
          상품 등록부터 정산까지 한 곳에서 관리하세요.
          <br />
          효율적인 상품 관리 시스템을 경험해보세요.
        </p>
      </header>

      {/* 대시보드 카드 레이아웃 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
        <DashboardItem
          title='상품 조회 & 관리'
          description='등록된 상품을 확인하고 관리하세요.'
          link='products/search'
          color='bg-brown-50'
          hoverColor='hover:bg-brown-100'
          icon={<FaBoxOpen className='text-brown-600' />}
        />
        <DashboardItem
          title='상품 등록'
          description={hasPendingProduct ? '이어서 등록하세요.' : '새로운 상품을 등록하세요.'}
          link='products/register'
          color='bg-brown-300'
          hoverColor='hover:bg-brown-400'
          icon={<FaShoppingCart className='text-brown-700' />}
        />
        <DashboardItem
          title='라이브 신청'
          description='라이브 커머스를 신청하세요.'
          link='lives/apply'
          color='bg-brown-50'
          hoverColor='hover:bg-brown-100'
          icon={<FaRegHandshake className='text-brown-600' />}
        />
        <DashboardItem
          title='주문 관리'
          description='진행 중인 주문을 확인하세요.'
          link='delivery/orders'
          color='bg-brown-300'
          hoverColor='hover:bg-brown-400'
          icon={<FaShoppingCart className='text-brown-700' />}
        />
        <DashboardItem
          title='판매 통계'
          description='판매 데이터를 확인하세요.'
          link='stats/overview'
          color='bg-brown-50'
          hoverColor='hover:bg-brown-100'
          icon={<FaChartLine className='text-brown-600' />}
        />
        <DashboardItem
          title='고객 문의'
          description='고객의 질문과 요청을 확인하세요.'
          link='inquiries/list'
          color='bg-brown-300'
          hoverColor='hover:bg-brown-400'
          icon={<FaQuestionCircle className='text-brown-700' />}
        />
        <DashboardItem
          title='정산 관리'
          description='정산 내역을 확인하고 관리하세요.'
          link='settlement/overview'
          color='bg-brown-50'
          hoverColor='hover:bg-brown-100'
          icon={<FaUsers className='text-brown-600' />}
        />
      </div>

      {/* 📢 판매자 광고 배너 */}
      <SellerAdBanner />
    </div>
  )
}

// 📌 개별 대시보드 아이템 (버튼 스타일 개선)
const DashboardItem = ({ title, description, link, color, hoverColor, icon }) => (
  <Link to={link} className='block transform transition-transform hover:scale-105'>
    <div
      className={`flex flex-col items-center justify-center p-8 rounded-xl text-brown-900 ${color} ${hoverColor} shadow-md hover:shadow-lg transition`}
    >
      <div className='text-5xl mb-4'>{icon}</div>
      <h3 className='font-bold text-xl text-center'>{title}</h3>
      <p className='text-sm text-center text-brown-600'>{description}</p>
    </div>
  </Link>
)

// 📢 판매자를 위한 광고 배너 컴포넌트
const SellerAdBanner = () => (
  <div className='bg-brown-100 text-brown-800 p-10 rounded-xl shadow-lg text-center max-w-4xl mx-auto'>
    <h2 className='text-3xl font-bold mb-4'>🚀 판매자를 위한 특별한 혜택!</h2>
    <p className='text-lg text-brown-700'>
      지금 가입하고 광고 프로모션을 무료로 경험하세요.
      <br />더 많은 고객에게 상품을 홍보하고, 매출을 극대화하세요!
    </p>
    <Link
      to='/seller/ads'
      className='mt-6 inline-block px-6 py-3 bg-brown-300 text-brown-900 font-semibold rounded-lg hover:bg-brown-400 transition'
    >
      광고 프로모션 알아보기
    </Link>
  </div>
)

export default Dashboard
