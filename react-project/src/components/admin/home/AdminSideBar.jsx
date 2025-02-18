import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const menuData = [
  {
    id: 1,
    title: '이용자 관리',
    subMenus: [
      {
        id: 1,
        title: '회원관리',
        items: [
          { id: 101, title: '회원 정보관리', path: '/admin/members/info' },
          { id: 102, title: '회원 레벨관리', path: '/admin/members/level' },
          { id: 103, title: '회원 등록하기', path: '/admin/members/register' },
          { id: 104, title: '회원 엑셀일괄등록', path: '/admin/members/excel' },
          { id: 105, title: '회원 메일발송', path: '/admin/members/email' },
        ],
      },
      {
        id: 2,
        title: '포인트 관리',
        items: [
          { id: 106, title: '포인트 관리', path: '/admin/points/info' },
          { id: 107, title: '포인트 엑셀일괄 등록', path: '/admin/points/excel' },
        ],
      },
      {
        id: 3,
        title: '가입 통계',
        items: [
          { id: 108, title: '일별 가입 통계 분석', path: '/admin/statistics/daily' },
          { id: 109, title: '월별 가입 통계 분석', path: '/admin/statistics/monthly' },
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
          { id: 201, title: '판매자 전체목록', path: '/admin/seller/info' },
          { id: 202, title: '판매권한 승인', path: '/admin/seller/register' },
        ],
      },
      {
        id: 5,
        title: '판매자 수수료',
        items: [
          { id: 203, title: '판매자 수수료내역', path: '/admin/fee/info' },
          { id: 204, title: '판매자 수수료정산', path: '/admin/fee/request' },
        ],
      },
      {
        id: 6,
        title: '판매자 기타',
        items: [
          { id: 205, title: '판매자 트리구조', path: '/admin/seller/tree' },
          { id: 206, title: '판매자 통계', path: '/admin/seller/statistics' },
        ],
      },
      {
        id: 7,
        title: '모니터링',
        items: [
          { id: 207, title: '주문현황', path: '/admin/seller/monitor/orders' },
          { id: 208, title: '상품현황', path: '/admin/seller/monitor/products' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: '주문 관리',
    items: [
      { id: 301, title: '주문 현황', path: '/admin/order' },
      { id: 302, title: '주문 분석', path: '설명: 주문 분석 페이지 추가 예정' },
      { id: 303, title: '상품별 환불 통계', path: '설명: 상품별 환불 통계 페이지 추가 예정' },
    ],
  },
  {
    id: 4,
    title: '라이브커머스 관리',
    subMenus: [
      {
        id: 7,
        title: '라이브커머스 관리',
        items: [
          { id: 401, title: '라이브커머스 신청관리', path: '/admin/live/register' },
          { id: 402, title: '라이브커머스 일정관리', path: '/admin/live/calender' },
          { id: 403, title: '라이브커머스 공지관리', path: '/admin/live/notice' },
          { id: 404, title: '라이브커머스 성과분석', path: '#' },
        ],
      },
      {
        id: 8,
        title: '라이브커머스 운영',
        items: [
          { id: 405, title: '진행중 라이브', path: '/admin/live/onair' },
          { id: 406, title: '종료된 라이브', path: '/admin/live/end' },
          { id: 407, title: '시청자 관리', path: '/admin/live/viewer' },
        ],
      },
    ],
  },
  {
    id: 5,
    title: '카테고리 관리',
    // 하위 메뉴가 없는 경우 바로 링크 연결
    path: '/admin/category',
  },
  {
    id: 6, // 기존 id와 겹치지 않도록 주의
    title: '컨텐츠 관리',
    subMenus: [
      {
        id: 9,
        title: '쿠폰 관리',
        items: [
          { id: 601, title: '쿠폰 현황 조회', path: '/admin/coupon/info' },
          { id: 602, title: '쿠폰 발급', path: '/admin/coupon/issue' },
        ],
      },
      {
        id: 10,
        title: '화면 관리',
        items: [
          { id: 603, title: '이벤트 배너 조회', path: '/admin/screen/info' },
          { id: 604, title: '이벤트 배너 등록', path: '/admin/screen/register' },
        ],
      },
      {
        id: 11,
        title: '신고 관리',
        items: [
          { id: 605, title: '신고 내역 조회', path: '/admin/report/info' },
          { id: 606, title: '신고 상세 조회 / 처리', path: '/admin/report/detail' },
        ],
      },
    ],
  },
  {
    id: 7,
    title: 'CS 관리',
    items: [
      { id: 701, title: '문의현황', path: '/admin/cs/cscenter' },
      { id: 702, title: '공지사항', path: '/admin/cs/notice' },
    ],
  },
  {
    id: 8,
    title: '쇼핑몰 분석',
    items: [
      { id: 801, title: '매출 분석', path: '/admin/analytics/performance' },
      { id: 802, title: '카테고리 분석', path: '/admin/analytics/category' },
      { id: 803, title: '시간대별 분석', path: '/admin/analytics/timesales' },
      { id: 804, title: '유저 통계', path: '/admin/analytics/users' },
      { id: 805, title: '재구매율 분석', path: '/admin/analytics/repurchase' },
    ],
  },
]

const SidebarItem = ({ item, isOpen, onToggle, onItemClick }) => {
  const hasSubMenus = item.subMenus && item.subMenus.length > 0
  const hasItems = item.items && item.items.length > 0

  return (
    <div className='w-64 -ml-2'>
      {/* 메뉴 클릭 이벤트 */}
      <div
        onClick={() => (item.path ? onItemClick(item.path) : onToggle(item.id))}
        className={`flex items-center justify-between p-3 cursor-pointer font-semibold text-[#5C4033] border-b border-[#D2B48C] hover:bg-[#FFF6E6] transition-all duration-200`}
      >
        <span>{item.title}</span>
        {(hasSubMenus || hasItems) && (
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>

      {/* 하위 메뉴 표시 */}
      {isOpen && (hasSubMenus || hasItems) && (
        <div className='pl-5 border-l border-gray-300'>
          {/* subMenus가 있는 경우 */}
          {item.subMenus?.map((sub) => (
            <div key={sub.id}>
              <div className='p-2 text-sm font-semibold text-[#5C4033]'>{sub.title}</div>
              <div className='pl-3'>
                {sub.items.map((menu) => (
                  <div
                    key={menu.id}
                    onClick={() => onItemClick(menu.path)}
                    className='cursor-pointer p-2 text-sm text-gray-600 hover:text-[#5C4033] transition-colors duration-200'
                  >
                    {menu.title}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* items만 있는 경우 */}
          {item.items?.map((menu) => (
            <div
              key={menu.id}
              onClick={() => onItemClick(menu.path)}
              className='cursor-pointer p-2 text-sm text-gray-600 hover:text-[#5C4033] transition-colors duration-200'
            >
              {menu.title}
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
    <div className='fixed top-0 left-0 h-full w-64 bg-white p-2.5 overflow-y-auto scrollbar-hide border-r border-[#D2B48C]'>
      <div className='mb-6'>
        <img
          src='/bobissueLogo2.png'
          alt='logo'
          className='h-12 w-auto cursor-pointer'
          onClick={() => navigate('/admin')}
        />
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
