import React from 'react'
import {
  UsersIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FolderIcon,
  VideoCameraIcon,
  ArchiveBoxIcon,
  TicketIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminSideBar = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  const navigate = useNavigate()
  const [open, setOpen] = React.useState(0) // 상위 메뉴 상태
  const [subOpen, setSubOpen] = React.useState(0) // 중간 메뉴 상태

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
    setSubOpen(0) // 중간 메뉴 초기화
  }

  const handleSubOpen = (value) => {
    setSubOpen(subOpen === value ? 0 : value)
  }
  if (!isAuthenticated) {
    return null // 로그인되지 않은 경우 네비바를 렌더링하지 않음
  }
  return (
    <div className='fixed top-0 left-0 h-full w-64 bg-white shadow-md p-4 overflow-y-auto'>
      {/* 로고 */}
      <div className='mb-4'>
        <h1
          className='text-2xl font-bold text-blue-600 ms-3 cursor-pointer'
          onClick={() => navigate('/admin')} // 클릭 시 admin 페이지로 이동
        >
          LOGO
        </h1>{' '}
      </div>

      {/* 메뉴 리스트 */}
      <div>
        {/* 1. 회원관리 */}
        <div>
          <div
            onClick={() => handleOpen(1)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 1 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <UsersIcon className='h-5 w-5' />
              <span className='text-gray-700'>회원관리</span>
            </div>
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-4 w-4 transition-transform ${open === 1 ? 'rotate-180' : ''}`}
            />
          </div>
          {open === 1 && (
            <div className='pl-4'>
              {/* 회원관리 */}
              <div>
                <div
                  onClick={() => handleSubOpen(1)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 1 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>회원관리</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 1 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 1 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/members/info')}
                      className='cursor-pointer p-2 hover:bg-gray-100'
                    >
                      회원 정보관리
                    </div>
                    <div
                      onClick={() => navigate('/admin/members/level')}
                      className='cursor-pointer p-2 hover:bg-gray-100'
                    >
                      회원 레벨관리
                    </div>
                    <div
                      onClick={() => navigate('/admin/members/register')}
                      className='cursor-pointer p-2 hover:bg-gray-100'
                    >
                      회원 등록하기
                    </div>
                    <div
                      onClick={() => navigate('/admin/members/excel')}
                      className='cursor-pointer p-2 hover:bg-gray-100'
                    >
                      회원 엑셀일괄등록
                    </div>
                    <div
                      onClick={() => navigate('/admin/members/email')}
                      className='cursor-pointer p-2 hover:bg-gray-100'
                    >
                      회원 메일발송
                    </div>
                  </div>
                )}
              </div>

              {/* 포인트 관리 */}
              <div>
                <div
                  onClick={() => handleSubOpen(2)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 2 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>포인트 관리</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 2 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 2 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/points/info')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      포인트 관리
                    </div>
                    <div
                      onClick={() => navigate('/admin/points/excel')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      포인트 엑셀일괄 등록
                    </div>
                  </div>
                )}
              </div>

              {/* 가입 통계 */}
              <div>
                <div
                  onClick={() => handleSubOpen(3)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 3 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>가입 통계</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 3 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 3 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/statistics/daily')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      일별 가입 통계 분석
                    </div>
                    <div
                      onClick={() => navigate('/admin/statistics/monthly')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      월별 가입 통계 분석
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. 판매자 관리 */}
        <div>
          <div
            onClick={() => handleOpen(2)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 2 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <BuildingStorefrontIcon className='h-5 w-5' />
              <span className='text-gray-700'>판매자 관리</span>
            </div>
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-4 w-4 transition-transform ${open === 2 ? 'rotate-180' : ''}`}
            />
          </div>
          {open === 2 && (
            <div className='pl-4'>
              <div>
                <div
                  onClick={() => handleSubOpen(4)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 4 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>판매자 관리</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 4 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 4 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/seller/info')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      판매자 전체목록
                    </div>
                    <div
                      onClick={() => navigate('/admin/seller/register')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      판매권한 승인
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div
                  onClick={() => handleSubOpen(5)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 5 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>판매자 수수료</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 5 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 5 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/fee/info')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      판매자 수수료내역
                    </div>
                    <div
                      onClick={() => navigate('/admin/fee/request')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      판매자 수수료정산
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div
                  onClick={() => handleSubOpen(6)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 6 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>판매자 기타</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 6 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 6 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/seller/tree')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      판매자 트리구조
                    </div>
                    <div
                      onClick={() => navigate('/admin/seller/order')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      판매자 주문통계
                    </div>
                  </div>
                )}
              </div>
              {/* 모니터링 */}
              <div>
                <div
                  onClick={() => handleSubOpen(12)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 12 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>모니터링</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 12 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 12 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/seller/monitor/orders')}
                      className='cursor-pointer p-2 hover:bg-gray-100'
                    >
                      주문현황
                    </div>
                    <div
                      onClick={() => navigate('/admin/seller/monitor/products')}
                      className='cursor-pointer p-2 hover:bg-gray-100'
                    >
                      상품현황
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. 카테고리 관리 */}
        <div>
          <div
            onClick={() => handleOpen(3)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 3 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <FolderIcon className='h-5 w-5' />
              <span onClick={() => navigate('/admin/category')} className='text-gray-700'>
                카테고리 관리
              </span>
            </div>
          </div>
        </div>

        {/* 4. 라이브커머스 관리 */}
        <div>
          <div
            onClick={() => handleOpen(4)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 4 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <VideoCameraIcon className='h-5 w-5' />
              <span className='text-gray-700'>라이브커머스 관리</span>
            </div>
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-4 w-4 transition-transform ${open === 4 ? 'rotate-180' : ''}`}
            />
          </div>
          {open === 4 && (
            <div className='pl-4'>
              <div>
                <div
                  onClick={() => handleSubOpen(7)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 7 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>라이브커머스 관리</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 7 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 7 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/live/register')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      라이브커머스 신청관리
                    </div>{' '}
                    <div
                      onClick={() => navigate('/admin/live/calender')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      라이브커머스 일정관리
                    </div>
                    <div
                      onClick={() => navigate('/admin/live/notice')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      라이브커머스 공지관리
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div
                  onClick={() => handleSubOpen(8)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 8 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>라이브커머스 운영</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 8 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 8 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/live/onair')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      진행중 라이브
                    </div>
                    <div
                      onClick={() => navigate('/admin/live/end')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      종료된 라이브
                    </div>
                    <div
                      onClick={() => navigate('/admin/live/viewer')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      시청자 관리
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. 상품 관리 */}
        {/* <div>
          <div
            onClick={() => handleOpen(5)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 5 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <ShoppingBagIcon className='h-5 w-5' />
              <span className='text-gray-700'>상품 관리</span>
            </div>
          </div>
        </div> */}

        {/* 6. 주문관리 */}
        {/* <div>
          <div
            onClick={() => handleOpen(6)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 6 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <ShoppingBagIcon className='h-5 w-5' />
              <span className='text-gray-700'>주문관리</span>
            </div>
          </div>
        </div> */}

        {/* 7. 통계분석 */}
        {/* <div>
          <div
            onClick={() => handleOpen(7)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 7 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <PresentationChartBarIcon className='h-5 w-5' />
              <span className='text-gray-700'>통계분석</span>
            </div>
          </div>
        </div> */}

        {/* 8. 컨텐츠 관리 */}
        <div>
          <div
            onClick={() => handleOpen(8)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 8 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <ArchiveBoxIcon className='h-5 w-5' />
              <span className='text-gray-700'>컨텐츠 관리</span>
            </div>
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-4 w-4 transition-transform ${open === 8 ? 'rotate-180' : ''}`}
            />
          </div>
          {open === 8 && (
            <div className='pl-4'>
              <div>
                <div
                  onClick={() => handleSubOpen(9)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 9 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>쿠폰 관리</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 9 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 9 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/coupon/info')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      쿠폰 현황 조회
                    </div>
                    <div
                      onClick={() => navigate('/admin/coupon/issue')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      쿠폰 발급
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div
                  onClick={() => handleSubOpen(10)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 10 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>화면 관리</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 10 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 10 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/screen/info')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      이벤트 배너 조회
                    </div>
                    <div
                      onClick={() => navigate('/admin/screen/register')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      이벤트 배너 등록
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div
                  onClick={() => handleSubOpen(11)}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    subOpen === 11 ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className='text-gray-700'>신고 관리</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${subOpen === 11 ? 'rotate-180' : ''}`}
                  />
                </div>
                {subOpen === 11 && (
                  <div className='pl-4 py-1 space-y-2'>
                    <div
                      onClick={() => navigate('/admin/report/info')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      신고 내역 조회
                    </div>
                    <div
                      onClick={() => navigate('/admin/report/detail')}
                      className='cursor-pointer p-2  hover:bg-gray-100'
                    >
                      신고 상세 조회 / 처리
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 9. 고객지원 */}
        <div>
          <div
            onClick={() => handleOpen(9)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              open === 9 ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center space-x-2'>
              <InboxIcon className='h-5 w-5' />
              <span className='text-gray-700'>CS 관리</span>
            </div>
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-4 w-4 transition-transform ${open === 9 ? 'rotate-180' : ''}`}
            />
          </div>
          {open === 9 && (
            <div className='pl-4 py-1 space-y-2'>
              <div
                onClick={() => navigate('/admin/cs/notification')}
                className='cursor-pointer p-2  hover:bg-gray-100'
              >
                알림 관리
              </div>
              <div
                onClick={() => navigate('/admin/cs/cscenter')}
                className='cursor-pointer p-2  hover:bg-gray-100'
              >
                문의현황
              </div>
              <div
                onClick={() => navigate('/admin/cs/notice')}
                className='cursor-pointer p-2  hover:bg-gray-100'
              >
                공지사항
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSideBar
