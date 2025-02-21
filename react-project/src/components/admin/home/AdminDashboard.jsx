import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import CountUp from 'react-countup'
import {
  ShoppingCartIcon,
  UsersIcon,
  StarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/solid'

const AdminDashBoard = () => {
  const [totalSales, setTotalSales] = useState(null)
  const [totalUsers, setTotalUsers] = useState(null)
  const [activeUsers, setActiveUsers] = useState(null)
  const [totalCompanies, setCompanies] = useState(null)
  const [bestItem, setBestItem] = useState('로딩 중...')
  const [recentOrders, setRecentOrders] = useState([])
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, usersRes, companiesRes, bestItemRes, ordersRes, usersListRes] =
          await Promise.all([
            API.get('/admin/total-sales'),
            API.get('/admin/user-statistics'),
            API.get('/admin/company-statistics'),
            API.get('/item/best-sellers'),
            API.get('/orders'),
            API.get('/users'),
          ])

        // 매출 데이터
        const total = salesRes?.data?.result?.data
        setTotalSales(total ?? 0)

        // 유저 통계
        const userData = usersRes?.data?.result?.data
        setTotalUsers(userData?.totalUsers ?? 0)
        setActiveUsers(userData?.activeUsers ?? 0)

        // 회사 수
        const companyData = companiesRes?.data?.result?.data
        setCompanies(companyData?.totalCompanies ?? 0)

        // 베스트 셀러
        const bestItems = bestItemRes?.data?.result?.data
        if (bestItems && bestItems.length > 0) {
          setBestItem(bestItems[0].itemName)
        }

        // 최근 주문 내역 (최대 5개)
        const orders = ordersRes?.data?.result?.data
        setRecentOrders(orders.slice(0, 5))

        // 최근 회원가입 유저 (최대 5명)
        const usersList = usersListRes?.data?.result?.data
        setRecentUsers(usersList.slice(0, 5))
      } catch (error) {
        console.error('데이터 가져오기 실패:', error)
      }
    }
    fetchData()
  }, [])

  const formatDate = (dateTime) => dateTime.split(' ')[0]

  return (
    <div>
      {/* 대시보드 메인 총 매출 카운트업 */}
      <div className='mb-4 text-center p-4 rounded-xl shadow-md bg-gradient-to-r from-[#5a4630] to-[#725a3e] animate-gradient-x h-32 flex items-center justify-center'>
        <h3 className='text-4xl font-bold text-white mr-4'>⚡ 이번달 총 매출</h3>
        <p className='text-4xl font-extrabold text-yellow-300'>
          <CountUp start={0} end={totalSales || 0} duration={2.5} separator=',' /> 원
        </p>
      </div>

      {/* 주요 통계 카드 */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <div className='bg-[#FDF6E3] shadow-md rounded-lg p-4 flex flex-col items-start'>
          <div className='flex items-center space-x-2 mb-2'>
            <ShoppingCartIcon className='h-6 w-6 text-[#5C4033]' />
            <h2 className='text-lg font-semibold text-gray-800'>총 매출</h2>
          </div>
          <p className='text-2xl font-bold text-gray-900'>
            {totalSales !== null ? `₩ ${totalSales.toLocaleString()}` : '로딩 중...'}
          </p>
        </div>

        <div className='bg-[#FAEBD7] shadow-md rounded-lg p-4 flex flex-col items-start'>
          <div className='flex items-center space-x-2 mb-2'>
            <UsersIcon className='h-6 w-6 text-[#5C4033]' />
            <h2 className='text-lg font-semibold text-gray-800'>총 유저 수</h2>
          </div>
          <p className='text-2xl font-bold text-gray-900'>
            {totalUsers !== null && activeUsers !== null
              ? `${totalUsers}명 (활성: ${activeUsers}명)`
              : '로딩 중...'}
          </p>
        </div>

        <div className='bg-[#FFF5E1] shadow-md rounded-lg p-4 flex flex-col items-start'>
          <div className='flex items-center space-x-2 mb-2'>
            <ClipboardDocumentListIcon className='h-6 w-6 text-[#5C4033]' />
            <h2 className='text-lg font-semibold text-gray-800'>판매자 회사 수</h2>
          </div>
          <p className='text-2xl font-bold text-gray-900'>
            {totalCompanies != null ? `${totalCompanies}개사` : `로딩 중 ...`}
          </p>
        </div>

        <div className='bg-[#FDF5E6] shadow-md rounded-lg p-4 flex flex-col items-start'>
          <div className='flex items-center space-x-2 mb-2'>
            <StarIcon className='h-6 w-6 text-[#5C4033]' />
            <h2 className='text-lg font-semibold text-gray-800'>베스트 상품</h2>
          </div>
          <p className='text-xl font-bold text-gray-900'>{bestItem}</p>
        </div>
      </div>

      {/* 최근 주문 내역 및 최근 회원 가입 나란히 배치 */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-white hover:shadow-md rounded-lg p-4 relative'>
          <h2 className='text-xl font-bold text-[#5C4033] mb-3 flex justify-between'>
            🛒 최근 주문 내역
            <button
              className='px-3 py-1 text-sm bg-[#5C4033] text-white rounded hover:bg-[#725a3e]'
              onClick={() => (window.location.href = '/admin/order')}
            >
              주문 현황 바로가기
            </button>
          </h2>
          <table className='w-full border border-[#D2B48C]'>
            <thead className='bg-[#FAEBD7] text-gray-700'>
              <tr>
                <th className='border border-[#D2B48C] p-2'>주문번호</th>
                <th className='border border-[#D2B48C] p-2'>결제수단</th>
                <th className='border border-[#D2B48C] p-2'>주문금액</th>
                <th className='border border-[#D2B48C] p-2'>주문일자</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className='text-center hover:bg-[#FFF5E1]'>
                  <td className='border border-[#D2B48C] p-2'>{order.orderNo}</td>
                  <td className='border border-[#D2B48C] p-2'>{order.payment}</td>
                  <td className='border border-[#D2B48C] p-2'>
                    ₩ {order.totalPrice.toLocaleString()}
                  </td>
                  <td className='border border-[#D2B48C] p-2'>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='bg-white hover:shadow-md rounded-lg p-4 relative'>
          <h2 className='text-xl font-bold text-[#5C4033] mb-3 flex justify-between'>
            🙋‍♂️ 최근 회원 가입
            <button
              className='px-3 py-1 text-sm bg-[#5C4033] text-white rounded hover:bg-[#725a3e]'
              onClick={() => (window.location.href = '/admin/members/info')}
            >
              회원 정보관리 바로가기
            </button>
          </h2>
          <table className='w-full border border-[#D2B48C]'>
            <thead className='bg-[#FAEBD7] text-gray-700'>
              <tr>
                <th className='border border-[#D2B48C] p-2'>이름</th>
                <th className='border border-[#D2B48C] p-2'>이메일</th>
                <th className='border border-[#D2B48C] p-2'>가입일자</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={index} className='text-center hover:bg-[#FFF5E1]'>
                  <td className='border border-[#D2B48C] p-2'>{user.name}</td>
                  <td className='border border-[#D2B48C] p-2'>{user.email}</td>
                  <td className='border border-[#D2B48C] p-2'>{formatDate(user.createAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard
