import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleMenu, menuState }) => {
  return (
    <aside
      className={`  top-0 left-0 z-40 bg-gray-50 shadow-md transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } `}
      style={{ height: 'calc(100vh - 3rem)' }} 
    >
      <header className="font-bold text-lg text-gray-800 px-5 py-3">판매자 메뉴</header>
      <ul className="space-y-1 px-2">
        {[
          { key: 'product', label: '상품 관리', links: [
            { to: 'products/register', text: '상품 등록하기' },
            { to: 'products/inquiry', text: '상품 조회하기' },
            { to: 'products/update', text: '상품 수정하기' },
          ]},
          { key: 'delivery', label: '주문/배송 관리', links: [
            { to: 'delivery/orders', text: '주문 정보 조회' },
            { to: 'delivery/shipping', text: '출고 중지 요청' },
            { to: 'delivery/delivers', text: '배송 관리' },
            { to: 'delivery/returns', text: '반품 관리' },
            { to: 'delivery/exchanges', text: '교환 관리' },
          ]},
          { key: 'settlement', label: '정산', links: [
            { to: 'settlement/overview', text: '정산 조회' },
            { to: 'settlement/details', text: '정산 상세' },
            { to: 'settlement/accounts', text: '정산 계좌 관리' },
          ]},
          { key: 'sellerInfo', label: '판매자 정보 관리', links: [
            { to: 'account/verification?redirect=info', text: '판매자 정보 조회' },
            { to: 'account/verification?redirect=update-info', text: '판매자 정보 수정' },
            { to: 'account/verification?redirect=update-password', text: '판매자 비밀번호 수정' },
            { to: 'account/verification?redirect=withdrawal', text: '판매자 탈퇴' },
          ]},
          { key: 'inquiry', label: '문의 응대', links: [
            { to: 'inquiries/list', text: '문의 조회' },
            { to: 'inquiries/replylist', text: '문의 답장' },
          ]},
          { key: 'liveCommerce', label: '라이브 커머스', links: [
            { to: 'live/home', text: '라이브 홈' },
            { to: 'live/apply', text: '라이브 신청하기' },
          ]},
          { key: 'salesStats', label: '판매 통계', links: [
            { to: 'stats/performance', text: '판매 성과 조회' },
            { to: 'stats/products', text: '상품 성과 조회' },
          ]},
          { key: 'notices', label: '공지사항', links: [
            { to: 'notices', text: '공지사항 조회' },
          ]},
        ].map(({ key, label, links }) => (
          <li key={key}>
            <button
              onClick={() => toggleMenu(key)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {label} {menuState[key] ? '▼' : '▶'}
            </button>
            {menuState[key] && (
              <ul className="pl-8 text-sm text-blue-600">
                {links.map(({ to, text }) => (
                  <Link key={to} to={to}>
                    <li className="py-1 hover:underline">{text}</li>
                  </Link>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
