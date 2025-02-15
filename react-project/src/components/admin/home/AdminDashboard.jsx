import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
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

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await API.get('/admin/total-sales')
        const total = response?.data?.result?.data
        if (total !== undefined) {
          setTotalSales(total)
        } else {
          console.error('총 매출 데이터가 없습니다.', response)
        }
      } catch (error) {
        console.error('총 매출 가져오기 실패:', error)
      }
    }

    const fetchTotalUsers = async () => {
      try {
        const response = await API.get('http://bobissue.duckdns.org:8082/api/admin/user-statistics')
        const userData = response?.data?.result?.data
        if (userData) {
          setTotalUsers(userData.totalUsers)
          setActiveUsers(userData.activeUsers)
        } else {
          console.error('유저 데이터가 없습니다.', response)
        }
      } catch (error) {
        console.error('유저 데이터 가져오기 실패:', error)
      }
    }

    fetchTotalSales()
    fetchTotalUsers()
  }, [])

  // 더미 데이터 생성
  const dummyOrders = [
    { orderNumber: '20240101', customer: '홍길동', amount: 50000, date: '2024-02-15' },
    { orderNumber: '20240102', customer: '김철수', amount: 70000, date: '2024-02-14' },
    { orderNumber: '20240103', customer: '이영희', amount: 65000, date: '2024-02-13' },
  ]

  const dummyUsers = [
    { name: '홍길동', email: 'hong@example.com', dateJoined: '2024-02-01' },
    { name: '김철수', email: 'kim@example.com', dateJoined: '2024-01-25' },
    { name: '이영희', email: 'lee@example.com', dateJoined: '2024-01-20' },
  ]

  return (
    <div>
      {/* <h1 className='text-2xl font-bold text-gray-800 mb-6'>📊 관리자 대시보드</h1> */}

      {/* 주요 통계 카드 */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <div className='bg-[#FDF6E3] shadow-md rounded-lg p-5 flex flex-col items-start'>
          <div className='flex items-center space-x-2 mb-2'>
            <ShoppingCartIcon className='h-6 w-6 text-[#5C4033]' />
            <h2 className='text-lg font-semibold text-gray-800'>총 매출</h2>
          </div>
          <p className='text-2xl font-bold text-gray-900'>
            {totalSales !== null ? `₩ ${totalSales.toLocaleString()}` : '로딩 중...'}
          </p>
        </div>

        <div className='bg-[#FAEBD7] shadow-md rounded-lg p-5 flex flex-col items-start'>
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

        <div className='bg-[#FFF5E1] shadow-md rounded-lg p-5 flex flex-col items-start'>
          <div className='flex items-center space-x-2 mb-2'>
            <ClipboardDocumentListIcon className='h-6 w-6 text-[#5C4033]' />
            <h2 className='text-lg font-semibold text-gray-800'>총 주문 수(예시)</h2>
          </div>
          <p className='text-2xl font-bold text-gray-900'>1,523건</p>
        </div>

        <div className='bg-[#FDF5E6] shadow-md rounded-lg p-5 flex flex-col items-start'>
          <div className='flex items-center space-x-2 mb-2'>
            <StarIcon className='h-6 w-6 text-[#5C4033]' />
            <h2 className='text-lg font-semibold text-gray-800'>이번주 베스트 상품(예시)</h2>
          </div>
          <p className='text-xl font-bold text-gray-900'>닭가슴살 5kg 패키지</p>
        </div>
      </div>

      {/* 최근 주문 내역 */}
      <div className='bg-white hover:shadow-md rounded-lg p-5 mb-6'>
        <h2 className='text-xl font-bold text-[#5C4033] mb-3'>🛒 최근 주문 내역</h2>
        <table className='w-full border border-[#D2B48C]'>
          <thead className='bg-[#FAEBD7] text-gray-700'>
            <tr>
              <th className='border border-[#D2B48C] p-2'>주문번호</th>
              <th className='border border-[#D2B48C] p-2'>고객명</th>
              <th className='border border-[#D2B48C] p-2'>주문금액</th>
              <th className='border border-[#D2B48C] p-2'>주문일자</th>
            </tr>
          </thead>
          <tbody>
            {dummyOrders.map((order, index) => (
              <tr key={index} className='text-center hover:bg-[#FFF5E1]'>
                <td className='border border-[#D2B48C] p-2'>{order.orderNumber}</td>
                <td className='border border-[#D2B48C] p-2'>{order.customer}</td>
                <td className='border border-[#D2B48C] p-2'>₩ {order.amount.toLocaleString()}</td>
                <td className='border border-[#D2B48C] p-2'>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 최근 회원 가입 */}
      <div className='bg-white hover:shadow-md rounded-lg p-5'>
        <h2 className='text-xl font-bold text-[#5C4033] mb-3'>🙋‍♂️ 최근 회원 가입</h2>
        <table className='w-full border border-[#D2B48C]'>
          <thead className='bg-[#FAEBD7] text-gray-700'>
            <tr>
              <th className='border border-[#D2B48C] p-2'>이름</th>
              <th className='border border-[#D2B48C] p-2'>이메일</th>
              <th className='border border-[#D2B48C] p-2'>가입일자</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((user, index) => (
              <tr key={index} className='text-center hover:bg-[#FFF5E1]'>
                <td className='border border-[#D2B48C] p-2'>{user.name}</td>
                <td className='border border-[#D2B48C] p-2'>{user.email}</td>
                <td className='border border-[#D2B48C] p-2'>{user.dateJoined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashBoard
