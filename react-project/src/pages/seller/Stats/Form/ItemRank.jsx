// ./Form/ItemRank.js
import React, { useEffect, useState } from 'react'
import API from '@/utils/API'
import { FaBoxOpen } from 'react-icons/fa'

const ItemRank = ({ selectedPeriod }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await API.get(`/sellers/item-rank`, { period: selectedPeriod })
        console.log(response)
        setItems(response.data.result.data)
      } catch (error) {
        console.error('Error fetching item rank:', error)
      }
    }
    fetchData()
  }, [selectedPeriod])

  return (
    <div className='bg-gray-50 p-6 rounded-xl border border-gray-300 shadow-md'>
      <div className='flex items-center gap-3 mb-4'>
        <FaBoxOpen className='text-4xl' />
        <h3 className='text-2xl font-semibold text-gray-800'>인기 판매 상품 순위</h3>
      </div>
      <div className='overflow-hidden rounded-lg border border-gray-200'>
        <table className='w-full bg-white rounded-lg text-gray-700'>
          <thead className='bg-gray-200 text-gray-900'>
            <tr>
              <th className='p-3 text-left'>상품명</th>
              <th className='p-3 text-right'>판매량</th>
              <th className='p-3 text-right'>매출</th>
              <th className='p-3 text-right'>평점</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.itemNo} className='border-b hover:bg-gray-100'>
                  <td className='p-3'>{item.itemName}</td>
                  <td className='p-3 text-right'>{item.totalSoldCount}</td>
                  <td className='p-3 text-right'>{item.totalSales.toLocaleString()}원</td>
                  <td className='p-3 text-right'>{item.averageRating.toFixed(1)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='p-3 text-center text-gray-500'>
                  데이터 없음
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ItemRank
