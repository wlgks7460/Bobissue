import React ,{useState}from 'react'
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
  FaBuilding,
} from 'react-icons/fa'

const Sidebar = ({ isOpen, toggleMenu, menuState,setSelect ,select}) => {
  //const [select,setSelect]=useState(null)
  return (
    <aside
      className={`fixed top-0 left-0 w-64 bg-gray-100 border-r border-gray-300 h-full overflow-y-auto shadow-md transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <ul className='space-y-2 p-4'>
        {[
          {
            key: 'product',
            label: '상품 관리',
            icon: <FaBox className='text-gray-600' />,
            links: [
              { to: 'products/register', text: '상품 등록하기' },
              { to: 'products/search', text: '상품 조회하기' },
            ],
          },
          {
            key: 'delivery',
            label: '주문/배송 관리',
            icon: <FaShippingFast className='text-gray-600' />,
            links: [
              { to: 'delivery/orders', text: '주문 정보 조회' },
              { to: 'delivery/delivers', text: '배송 관리' },
              { to: 'delivery/returns', text: '환불 관리' },
            ],
          },
          {
            key: 'settlement',
            label: '정산',
            icon: <FaChartBar className='text-gray-600' />,
            links: [
              { to: 'settlement/overview', text: '정산 조회' },
              { to: 'settlement/details', text: '정산 상세' },
            ],
          },
          {
            key: 'salesStats',
            label: '판매 통계',
            icon: <FaChartLine className='text-gray-600' />,
            links: [
              { to: 'stats/overview', text: '판매 개요' },
              { to: 'stats/products', text: '상품 성과 조회' },
            ],
          },
          {
            key: 'sellerInfo',
            label: '판매자 정보 관리',
            icon: <FaUserCog className='text-gray-600' />,
            links: [
              { to: 'account/verification', text: '판매자 정보 조회' },
              { to: 'account/update-password', text: '판매자 비밀번호 수정' },
            ],
          },
          {
            key: 'inquiry',
            label: '문의 응대',
            icon: <FaComments className='text-gray-600' />,
            links: [
              { to: 'inquiries/list', text: '문의 조회' },
              { to: 'inquiries/replylist', text: '문의 답장' },
            ],
          },
          {
            key: 'liveCommerce',
            label: '라이브 커머스',
            icon: <FaVideo className='text-gray-600' />,
            links: [
              { to: 'lives/home', text: '라이브 홈' },
              { to: 'lives/apply', text: '라이브 신청하기' },
            ],
          },
          {
            key: 'company',
            label: '내 회사 관리',
            icon: <FaBuilding className='text-gray-600' />,
            links: [
              { to: 'company/append', text: '계정 추가하기' },
              // { to: 'company/search', text: '계정 관리하기' },
              { to: 'company/update', text: '회사 정보수정' },
            ],
          },
          {
            key: 'notices',
            label: '공지사항',
            icon: <FaBullhorn className='text-gray-600' />,
            links: [{ to: 'notices', text: '공지사항 조회' }],
          },
        ].map(({ key, label, icon, links }) => (
          <li key={key} className='relative'>
            {/* 메인 메뉴 버튼 */}
            <button
              onClick={() => toggleMenu(key)}
              className='w-full flex items-center justify-between px-4 py-3 text-gray-800 font-semibold  rounded-lg hover:bg-gray-300 transition'
            >
              <span className='flex items-center gap-2'>
                {icon} {label}
              </span>
              <span className='text-xs'>{menuState[key] ? '▼' : '▶'}</span>
            </button>

            {/* 서브 메뉴 */}
            {menuState[key] && (
              <ul className='pl-6 text-sm text-gray-800 space-y-1 mt-1'>
                {links.map(({ to, text }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`block py-2 px-3 rounded-lg transition 
                        ${select === text ? "text-rose-600" :"text-sky-800"}`}
                      onClick={()=>{setSelect(text)
                        console.log(select);
                        console.log(text);
                      }
                      }
                    >
                      {text}
                      
                      
                      
                    </Link>
                  </li>
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
