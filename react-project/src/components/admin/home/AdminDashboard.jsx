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
        const response = await API.get('/admin/user-statistics')
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

    const fetchTotalCompanies = async () => {
      try {
        const response = await API.get('/admin/company-statistics')
        const companyData = response?.data?.result?.data
        if (companyData) {
          setCompanies(companyData.totalCompanies)
        } else {
          console.error('회사 데이터가 없습니다.', response)
        }
      } catch (error) {
        console.error('회사 데이터 가져오기 실패:', error)
      }
    }
    fetchTotalSales()
    fetchTotalUsers()
    fetchTotalCompanies()
  }, [])

  // 더미 데이터 생성 - 최근 7개 고정으로 렌더링
  const dummyOrders = [
    { orderNumber: '20240101', customer: '김지한', amount: 50000, date: '2024-02-15' },
    { orderNumber: '20240102', customer: '김지원', amount: 70000, date: '2024-02-14' },
    { orderNumber: '20240103', customer: '이다은', amount: 65000, date: '2024-02-13' },
    { orderNumber: '20240101', customer: '강현호', amount: 50000, date: '2024-02-15' },
    { orderNumber: '20240102', customer: '윤경상', amount: 70000, date: '2024-02-14' },
    { orderNumber: '20240103', customer: '김경은', amount: 65000, date: '2024-02-13' },
    { orderNumber: '20240103', customer: '손흥민', amount: 65000, date: '2024-02-13' },
  ]

  const dummyUsers = [
    { name: '김지한', email: 'hong@example.com', dateJoined: '2024-02-01' },
    { name: '김철수', email: 'kim@example.com', dateJoined: '2024-01-25' },
    { name: '이다은', email: 'lee@example.com', dateJoined: '2024-01-20' },
    { name: '강현호', email: 'hong@example.com', dateJoined: '2024-02-01' },
    { name: '김철수', email: 'kim@example.com', dateJoined: '2024-01-25' },
    { name: '윤경상', email: 'lee@example.com', dateJoined: '2024-01-20' },
    { name: '김경은', email: 'lee@example.com', dateJoined: '2024-01-20' },
  ]

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
            <h2 className='text-lg font-semibold text-gray-800'>이번주 베스트 상품(예시)</h2>
          </div>
          <p className='text-xl font-bold text-gray-900'>닭가슴살 5kg 패키지</p>
        </div>
      </div>

      {/* 최근 주문 내역 및 최근 회원 가입 나란히 배치 */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-white hover:shadow-md rounded-lg p-4 relative'>
          <h2 className='text-xl font-bold text-[#5C4033] mb-3 flex justify-between'>
            🛒 최근 주문 내역
            <button className='px-3 py-1 text-sm bg-[#5C4033] text-white rounded hover:bg-[#725a3e]'>
              주문 현황 바로가기
            </button>
          </h2>
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

        <div className='bg-white hover:shadow-md rounded-lg p-4 relative'>
          <h2 className='text-xl font-bold text-[#5C4033] mb-3 flex justify-between'>
            🙋‍♂️ 최근 회원 가입
            <button className='px-3 py-1 text-sm bg-[#5C4033] text-white rounded hover:bg-[#725a3e]'>
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
    </div>
  )
}

export default AdminDashBoard
