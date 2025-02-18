import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import { Search } from 'lucide-react'

const OrderList = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '주문 관리' }, { name: '주문 현황' }]
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('orderNo')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders')
        setOrders(response.data.result.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery)
  }

  const formatDate = (dateStr) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    const hour = dateStr.slice(9, 11)
    const minute = dateStr.slice(11, 13)
    const second = dateStr.slice(13, 15)
    return `${year}년 ${month}월 ${day}일 ${hour}:${minute}:${second}`
  }

  const filteredOrders = appliedSearchQuery
    ? orders.filter((order) => {
        const value = String(order[searchType])
        return value === appliedSearchQuery
      })
    : orders

  const handleRowClick = (orderNo) => {
    navigate(`/admin/order/${orderNo}`)
  }

  if (loading) return <p className='text-center text-gray-500'>로딩 중...</p>
  if (error)
    return <p className='text-center text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>주문 현황</h1>

      <div className='mb-4 flex space-x-4'>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className='border p-2 rounded'
        >
          <option value='orderNo'>주문번호</option>
          <option value='userNo'>회원번호</option>
          <option value='payment'>결제수단</option>
          <option value='orderStatus'>주문 상태</option>
          <option value='deliveryStatus'>배송 상태</option>
        </select>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='검색어를 입력하세요'
          className='border p-2 rounded w-64'
        />
        <button onClick={handleSearch} className='bg-blue-500 text-white px-4 py-2 rounded'>
          조회
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>주문번호</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>회원번호</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>결제수단</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>총 금액</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>주문 상태</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>배송 상태</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>주문일</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>상세보기</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {filteredOrders.map((order) => (
              <tr key={order.orderNo} className='hover:bg-gray-50'>
                <td className='px-4 py-2 text-sm text-gray-700'>{order.orderNo}</td>
                <td className='px-4 py-2 text-sm text-gray-700'>{order.userNo}</td>
                <td className='px-4 py-2 text-sm text-gray-700'>{order.payment}</td>
                <td className='px-4 py-2 text-sm text-gray-700'>
                  {order.totalPrice.toLocaleString()}원
                </td>
                <td className='px-4 py-2 text-sm text-gray-700'>{order.orderStatus}</td>
                <td className='px-4 py-2 text-sm text-gray-700'>{order.deliveryStatus}</td>
                <td className='px-4 py-2 text-sm text-gray-700'>{formatDate(order.createdAt)}</td>
                {/* 회원 상세 정보 버튼 */}
                <td className='border px-4 py-2 text-center'>
                  <button
                    onClick={() => handleRowClick(order.orderNo)}
                    className='text-[#6D4C41] hover:text-[#3E2723]'
                  >
                    <Search size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan='8' className='text-center text-gray-500 py-4'>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderList
