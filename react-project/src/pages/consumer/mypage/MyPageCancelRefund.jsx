import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import MyPageCancelRefundItem from '../../../components/consumer/mypage/MyPageCancelRefundItem'

const MyPageCancelRefund = () => {
  const [cancelRefundData, setCancelRefundData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const [filter, setFilter] = useState('1개월') // 필터
  const filteres = [
    // 필터 목록
    { filterNo: 0, value: '1개월' },
    { filterNo: 1, value: '3개월' },
    { filterNo: 2, value: '6개월' },
    { filterNo: 3, value: '1년' },
    { filterNo: 4, value: '3년' },
  ]
  /** 필터 변경 함수 */
  const handleFilter = (value) => {
    setFilter(value)
    setFilteredData(filterDataByDate(cancelRefundData, value))
  }

  /** 날짜에 맞게 필터링 함수 */
  const filterDataByDate = (data, period) => {
    const now = dayjs()
    let cutoffDate

    switch (period) {
      case '1개월':
        cutoffDate = now.subtract(1, 'month')
        break
      case '3개월':
        cutoffDate = now.subtract(3, 'month')
        break
      case '6개월':
        cutoffDate = now.subtract(6, 'month')
        break
      case '1년':
        cutoffDate = now.subtract(1, 'year')
        break
      case '3년':
        cutoffDate = now.subtract(3, 'year')
        break
      default:
        return orders
    }

    return data.filter((v) => {
      const date = dayjs(v.createAt, 'YYYYMMDD HHmmss')
      return date.isAfter(cutoffDate)
    })
  }

  return (
    <div className='p-5'>
      <h3 className='text-center text-xl mb-5'>취소 / 환불 내역</h3>
      {/* 주문 내역 필터 */}
      <div className='border-b-2 border-[#6F4E37] flex justify-center gap-5 mb-10'>
        {filteres.map((v) => (
          <button
            key={v.filterNo}
            className={`w-[100px] text-center ${filter === v.value ? 'bg-[#6F4E37] text-white' : 'bg-gray-300'} m-3 p-1 rounded-full`}
            onClick={() => handleFilter(v.value)}
          >
            {v.value}
          </button>
        ))}
      </div>
      {/*  취소/환불 내역 */}
      <div>
        {filteredData.length > 0 ? (
          <div className='grid grid-cols-3 gap-y-10'>
            {filteredData.map((v) => (
              <MyPageCancelRefundItem key={v.recipeNo} recipe={v} getRecipeData={getRecipeData} />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-3 items-center'>
            <p className='text-center'>
              <ExclamationCircleIcon className='w-20 text-gray-400' />
            </p>
            <p className='text-center text-xl text-gray-600'>취소 / 환불 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPageCancelRefund
