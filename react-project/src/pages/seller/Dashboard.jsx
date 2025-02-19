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
  const dashboardItems = [
    {
      title: '상품 조회 & 관리',
      description: '등록된 상품을 확인하고 관리하세요.',
      link: 'products/search',
      icon: <FaBoxOpen />,
    },
    {
      title: '상품 등록',
      description: '새로운 상품을 등록하세요.',
      link: 'products/register',
      icon: <FaShoppingCart />,
    },
    {
      title: '라이브 신청',
      description: '라이브 커머스를 신청하세요.',
      link: 'lives/apply',
      icon: <FaRegHandshake />,
    },
    {
      title: '주문 관리',
      description: '진행 중인 주문을 확인하세요.',
      link: 'delivery/orders',
      icon: <FaShoppingCart />,
    },
    {
      title: '판매 통계',
      description: '판매 데이터를 확인하세요.',
      link: 'stats/overview',
      icon: <FaChartLine />,
    },
    {
      title: '고객 문의',
      description: '고객의 질문과 요청을 확인하세요.',
      link: 'inquiries/list',
      icon: <FaQuestionCircle />,
    },
    {
      title: '정산 관리',
      description: '정산 내역을 확인하고 관리하세요.',
      link: 'settlement/overview',
      icon: <FaUsers />,
    },
  ]

  return (
    <div className='w-full mx-auto px-8 py-10 min-h-screen bg-warmBeige/20'>
      {/* 헤더 */}
      <header className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold text-espressoBlack'>상품 관리, 쉽고 간편하게</h1>
        <p className='text-lg text-coffeeBrown mt-3'>
          상품 등록부터 정산까지 한 곳에서 관리하세요.
        </p>
      </header>

      {/* 대시보드 카드 레이아웃 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
        {dashboardItems.map((item, index) => (
          <DashboardItem
            key={index}
            title={item.title}
            description={item.description}
            link={item.link}
            icon={item.icon}
            color={index % 2 === 0 ? 'bg-latteBeige/30' : 'bg-espressoBlack/80'}
            text={index % 2 === 0 ? 'text-coffeeBrown' : 'text-warmBeige'}
            hoverColor={index % 2 === 0 ? 'hover:bg-warmBeige' : 'hover:bg-espressoBlack/90'}
            hoverText={index % 2 === 0 ? 'hover:text-espressoBlack' : 'hover:text-warmBeige/90'}
          />
        ))}
      </div>

      {/* 📢 판매자 광고 배너 */}
      <SellerAdBanner />
    </div>
  )
}

// 📌 개별 대시보드 아이템 (버튼 스타일 개선)
const DashboardItem = ({ title, description, link, color, hoverColor, icon, text, hoverText }) => (
  <Link to={link} className='block transform transition-transform hover:scale-105'>
    <div
      className={`flex flex-col items-center justify-center p-8 rounded-xl shadow-md ${text} ${color} ${hoverColor} ${hoverText} hover:shadow-lg transition`}
    >
      <div className='text-5xl mb-4'>{icon}</div>
      <h3 className='font-bold text-xl text-center'>{title}</h3>
      <p className='text-sm text-center'>{description}</p>
    </div>
  </Link>
)

// 📢 판매자를 위한 광고 배너 컴포넌트
const SellerAdBanner = () => (
  <div className='bg-coffeeBrown text-warmBeige p-10 rounded-xl shadow-lg text-center max-w-4xl mx-auto'>
    <h2 className='text-3xl font-bold mb-4'>🚀 판매자를 위한 특별한 혜택!</h2>
    <p className='text-lg'>
      지금 가입하고 광고 프로모션을 무료로 경험하세요.
      <br />더 많은 고객에게 상품을 홍보하고, 매출을 극대화하세요!
    </p>
    <Link
      to='/seller/ads'
      className='mt-6 inline-block px-6 py-3 bg-caramelTan text-espressoBlack font-semibold rounded-lg hover:text-warmBeige hover:bg-roastedCocoa transition'
    >
      광고 프로모션 알아보기
    </Link>
  </div>
)

export default Dashboard
