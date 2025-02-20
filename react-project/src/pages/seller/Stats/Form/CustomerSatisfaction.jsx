// ./Form/CustomerSatisfaction.js
import React, { useEffect, useState } from 'react'
import API from '@/utils/API'
import { FaSmile } from 'react-icons/fa'

const CustomerSatisfaction = ({ selectedPeriod }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await API.get('/sellers/customer-satisfaction', { period: selectedPeriod })
        console.log('hello')
        setData(response.data.result.data)
      } catch (error) {
        console.error('Error fetching customer satisfaction:', error)
      }
    }
    fetchData()
  }, [selectedPeriod])

  return (
    <div className='bg-gray-50 p-6 rounded-xl border border-gray-300 shadow-md'>
      <div className='flex items-center gap-3 mb-4'>
        <FaSmile className='text-4xl ' />
        <h3 className='text-2xl font-semibold text-gray-800'>고객 만족도</h3>
      </div>
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white p-4'>
        {data ? (
          <ul className='space-y-3 text-gray-700'>
            <li className='flex justify-between border-b pb-2'>
              <span>재구매율:</span> <span className='font-semibold'>{data.repurchaseRate}%</span>
            </li>
            <li className='flex justify-between border-b pb-2'>
              <span>평균 평점:</span>{' '}
              <span className='font-semibold'>{data.averageRating.toFixed(1)}</span>
            </li>
            <li className='flex justify-between border-b pb-2'>
              <span>주문 취소 건수:</span> <span className='font-semibold'>{data.cancelCount}</span>
            </li>
            <li className='flex justify-between border-b pb-2'>
              <span>환불 건수:</span> <span className='font-semibold'>{data.refundCount}</span>
            </li>
            <li className='flex justify-between'>
              <span>총 주문 건수:</span> <span className='font-semibold'>{data.totalOrders}</span>
            </li>
          </ul>
        ) : (
          <p className='text-gray-500 text-center'>데이터 없음</p>
        )}
      </div>
    </div>
  )
}

export default CustomerSatisfaction
