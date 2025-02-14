import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const menuData = [
  {
    id: 1,
    title: '회원관리',
    subMenus: [
      {
        id: 1,
        title: '회원관리',
        items: [
          { id: 1, title: '회원 정보관리', path: '/admin/members/info' },
          { id: 2, title: '회원 레벨관리', path: '/admin/members/level' },
          { id: 3, title: '회원 등록하기', path: '/admin/members/register' },
          { id: 4, title: '회원 엑셀일괄등록', path: '/admin/members/excel' },
          { id: 5, title: '회원 메일발송', path: '/admin/members/email' },
        ],
      },
      {
        id: 2,
        title: '포인트 관리',
        items: [
          { id: 1, title: '포인트 관리', path: '/admin/points/info' },
          { id: 2, title: '포인트 엑셀일괄 등록', path: '/admin/points/excel' },
        ],
      },
      {
        id: 3,
        title: '가입 통계',
        items: [
          { id: 1, title: '일별 가입 통계 분석', path: '/admin/statistics/daily' },
          { id: 2, title: '월별 가입 통계 분석', path: '/admin/statistics/monthly' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: '판매자 관리',
    subMenus: [
      {
        id: 4,
        title: '판매자 관리',
        items: [
          { id: 1, title: '판매자 전체목록', path: '/admin/seller/info' },
          { id: 2, title: '판매권한 승인', path: '/admin/seller/register' },
        ],
      },
      {
        id: 5,
        title: '판매자 수수료',
        items: [
          { id: 1, title: '판매자 수수료내역', path: '/admin/fee/info' },
          { id: 2, title: '판매자 수수료정산', path: '/admin/fee/request' },
        ],
      },
      {
        id: 6,
        title: '판매자 기타',
        items: [
          { id: 1, title: '판매자 트리구조', path: '/admin/seller/tree' },
          { id: 2, title: '판매자 주문통계', path: '/admin/seller/order' },
        ],
      },
      {
        id: 12,
        title: '모니터링',
        items: [
          { id: 1, title: '주문현황', path: '/admin/seller/monitor/orders' },
          { id: 2, title: '상품현황', path: '/admin/seller/monitor/products' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: '카테고리 관리',
    // 하위 메뉴가 없는 경우 바로 링크 연결
    path: '/admin/category',
  },
  {
    id: 4,
    title: '라이브커머스 관리',
    subMenus: [
      {
        id: 7,
        title: '라이브커머스 관리',
        items: [
          { id: 1, title: '라이브커머스 신청관리', path: '/admin/live/register' },
          { id: 2, title: '라이브커머스 일정관리', path: '/admin/live/calender' },
          { id: 3, title: '라이브커머스 공지관리', path: '/admin/live/notice' },
          { id: 4, title: '라이브커머스 성과분석', path: '#' },
        ],
      },
      {
        id: 8,
        title: '라이브커머스 운영',
        items: [
          { id: 1, title: '진행중 라이브', path: '/admin/live/onair' },
          { id: 2, title: '종료된 라이브', path: '/admin/live/end' },
          { id: 3, title: '시청자 관리', path: '/admin/live/viewer' },
        ],
      },
    ],
  },
  {
    id: 8, // 기존 id와 겹치지 않도록 주의
    title: '컨텐츠 관리',
    subMenus: [
      {
        id: 9,
        title: '쿠폰 관리',
        items: [
          { id: 1, title: '쿠폰 현황 조회', path: '/admin/coupon/info' },
          { id: 2, title: '쿠폰 발급', path: '/admin/coupon/issue' },
        ],
      },
      {
        id: 10,
        title: '화면 관리',
        items: [
          { id: 1, title: '이벤트 배너 조회', path: '/admin/screen/info' },
          { id: 2, title: '이벤트 배너 등록', path: '/admin/screen/register' },
        ],
      },
      {
        id: 11,
        title: '신고 관리',
        items: [
          { id: 1, title: '신고 내역 조회', path: '/admin/report/info' },
          { id: 2, title: '신고 상세 조회 / 처리', path: '/admin/report/detail' },
        ],
      },
    ],
  },
  {
    id: 9,
    title: 'CS 관리',
    subMenus: [
      {
        id: 1,
        title: 'CS 관리',
        items: [
          { id: 1, title: '알림 관리', path: '/admin/cs/notification' },
          { id: 2, title: '문의현황', path: '/admin/cs/cscenter' },
          { id: 3, title: '공지사항', path: '/admin/cs/notice' },
        ],
      },
    ],
  },
  // ──────────────────────────────────────────────
  // 추가할 새로운 메뉴 항목들 (페이지 미구현: 설명 문자열 포함)
  {
    id: 10,
    title: '대시보드',
    subMenus: [
      {
        id: 1,
        title: '대시보드 분석',
        items: [
          { id: 1, title: '매출 분석', path: '설명: 매출 분석 페이지 추가 예정' },
          { id: 2, title: '주문 분석', path: '설명: 주문 분석 페이지 추가 예정' },
          { id: 3, title: '고객 분석', path: '설명: 고객 분석 페이지 추가 예정' },
          { id: 4, title: '재고 분석', path: '설명: 재고 분석 페이지 추가 예정' },
          { id: 5, title: '회사 통계', path: '설명: 회사 통계 페이지 추가 예정' },
        ],
      },
    ],
  },
  {
    id: 11,
    title: '트렌드 분석',
    subMenus: [
      {
        id: 1,
        title: '트렌드 분석',
        items: [
          {
            id: 1,
            title: '판매 카테고리별 매출 추이',
            path: '설명: 판매 카테고리별 매출 추이 페이지 추가 예정',
          },
          { id: 2, title: '상품별 판매 트렌드', path: '설명: 상품별 판매 트렌드 페이지 추가 예정' },
          {
            id: 3,
            title: '주문 유형별 트렌드',
            path: '설명: 주문 유형별 트렌드 페이지 추가 예정',
          },
          {
            id: 4,
            title: '고객 세그먼트별 구매 패턴',
            path: '설명: 고객 세그먼트별 구매 패턴 페이지 추가 예정',
          },
        ],
      },
    ],
  },
  {
    id: 12,
    title: '주문 관리',
    subMenus: [
      {
        id: 1,
        title: '주문 관리',
        items: [
          { id: 1, title: '주문 현황', path: '설명: 주문 현황 페이지 추가 예정' },
          { id: 2, title: '주문 분석', path: '설명: 주문 분석 페이지 추가 예정' },
          { id: 3, title: '상품별 환불 통계', path: '설명: 상품별 환불 통계 페이지 추가 예정' },
        ],
      },
    ],
  },
  {
    id: 13,
    title: '고객 관리',
    subMenus: [
      {
        id: 1,
        title: '고객 관리',
        items: [
          { id: 1, title: '재구매율 분석', path: '설명: 재구매율 분석 페이지 추가 예정' },
          { id: 2, title: '유저 통계', path: '설명: 유저 통계 페이지 추가 예정' },
        ],
      },
    ],
  },
]

const SidebarItem = ({ item, isOpen, onToggle, onItemClick }) => {
  return (
    <div className='w-64 -ml-2'>
      <div
        onClick={() => (item.path ? onItemClick(item.path) : onToggle(item.id))}
        className={`flex items-center justify-between p-3 cursor-pointer font-semibold text-gray-800 border-b border-gray-200 hover:bg-blue-50 transition-all duration-200`}
      >
        <span>{item.title}</span>
        {item.subMenus && (
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>
      {isOpen && item.subMenus && (
        <div className='pl-5 border-l border-gray-300'>
          {item.subMenus.map((sub) => (
            <div key={sub.id}>
              <div className='p-2 text-sm text-gray-700 font-medium'>{sub.title}</div>
              <div className='pl-3'>
                {sub.items.map((menu) => (
                  <div
                    key={menu.id}
                    onClick={() => onItemClick(menu.path)}
                    className='cursor-pointer p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded'
                  >
                    {menu.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AdminSideBar = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const navigate = useNavigate()
  const [openId, setOpenId] = useState(null)

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id)
  }

  const handleItemClick = (path) => {
    navigate(path)
  }

  if (!isAuthenticated) return null

  return (
    <div className='fixed top-0 left-0 h-full w-64 bg-white shadow-md p-2.5 overflow-y-auto'>
      <div className='mb-6'>
        <h1
          className='text-2xl font-bold text-blue-700 cursor-pointer'
          onClick={() => navigate('/admin')}
        >
          Admin Panel
        </h1>
      </div>

      {menuData.map((item) => (
        <SidebarItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={handleToggle}
          onItemClick={handleItemClick}
        />
      ))}
    </div>
  )
}

export default AdminSideBar
