import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaBox,
  FaShippingFast,
  FaChartBar,
  FaUserCog,
  FaComments,
  FaVideo,
  FaBullhorn,
  FaChartLine,
} from 'react-icons/fa'

const Sidebar = ({ isOpen, toggleMenu, menuState }) => {
  return (
    <aside
      className={`fixed top-0 left-0 w-64 bg-white border-r h-full overflow-y-auto transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <header className='font-bold text-lg text-gray-800 px-6 py-4 border-b bg-gray-100'>판매자 메뉴</header> */}
      <ul className='space-y-2 p-4'>
        {[
          {
            key: 'product',
            label: '상품 관리',
            icon: <FaBox className='inline-block mr-2' />,
            links: [
              { to: 'products/register', text: '상품 등록하기' },
              { to: 'products/Search', text: '상품 조회하기' },
            ],
          },
          {
            key: 'delivery',
            label: '주문/배송 관리',
            icon: <FaShippingFast className='inline-block mr-2' />,
            links: [
              { to: 'delivery/orders', text: '주문 정보 조회' },
              { to: 'delivery/delivers', text: '배송 관리' },
              { to: 'delivery/returns', text: '환불 관리' },
            
            ],
          },
          {
            key: 'settlement',
            label: '정산',
            icon: <FaChartBar className='inline-block mr-2' />,
            links: [
              { to: 'settlement/overview', text: '정산 조회' },
              { to: 'settlement/details', text: '정산 상세' },
            ],
          },
          {
            key: 'salesStats',
            label: '판매 통계',
            icon: <FaChartLine className='inline-block mr-2' />,
            links: [
              { to: 'stats/performance', text: '판매 성과 조회' },
              { to: 'stats/products', text: '상품 성과 조회' },
            ],
          },
          {
            key: 'sellerInfo',
            label: '판매자 정보 관리',
            icon: <FaUserCog className='inline-block mr-2' />,
            links: [
              { to: 'account/verification', text: '판매자 정보 조회' },
              { to: 'account/update-password', text: '판매자 비밀번호 수정' },
            ],
          },
          {
            key: 'inquiry',
            label: '문의 응대',
            icon: <FaComments className='inline-block mr-2' />,
            links: [
              { to: 'inquiries/list', text: '문의 조회' },
              { to: 'inquiries/replylist', text: '문의 답장' },
            ],
          },
          {
            key: 'liveCommerce',
            label: '라이브 커머스',
            icon: <FaVideo className='inline-block mr-2' />,
            links: [
              { to: 'lives/home', text: '라이브 홈' },
              { to: 'lives/apply', text: '라이브 신청하기' },
            ],
          },
          {
            key: 'notices',
            label: '공지사항',
            icon: <FaBullhorn className='inline-block mr-2' />,
            links: [{ to: 'notices', text: '공지사항 조회' }],
          },
        ].map(({ key, label, icon, links }) => (
          <li key={key} className='relative'>
            <button
              onClick={() => toggleMenu(key)}
              className='w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-md'
            >
              <span className='flex items-center'>
                {icon} {label}
              </span>
              <span>{menuState[key] ? '▼' : '▶'}</span>
            </button>
            {menuState[key] && (
              <ul className='pl-6 text-sm text-blue-600 space-y-1'>
                {links.map(({ to, text }) => (
                  <Link key={to} to={to}>
                    <li className='py-1 hover:underline'>{text}</li>
                  </Link>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
