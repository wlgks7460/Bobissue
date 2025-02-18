import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const RepurchaseAnalysisComponent = () => {
  const [topRepurchaseItems, setTopRepurchaseItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const breadcrumbPaths = [{ name: 'Home' }, { name: '쇼핑몰 분석' }, { name: '재구매율 분석' }]

  useEffect(() => {
    console.log('📡 API 호출 시작...')
    const fetchData = async () => {
      try {
        console.log('🔥 fetchData 함수 실행됨')
        const response = await API.get('/item/top-repurchase')
        console.log('✅ API 응답:', response)

        if (response.status === 200 && response.data.status === 'OK') {
          setTopRepurchaseItems(response.data.result.data)
        } else {
          throw new Error('데이터 조회 실패')
        }
      } catch (error) {
        console.error('⚠️ API 호출 실패:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>재구매율 분석</h2>
        <p>⏳ 로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>재구매율 분석</h2>
        <p className='text-red-500'>❌ 에러 발생: {error}</p>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>재구매율 분석</h2>
      <h2 className='text-xl font-bold mb-6'>| TOP 10</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full text-center bg-white border border-gray-300 rounded-lg shadow-sm'>
          <thead className='bg-blue-500 text-white'>
            <tr>
              <th className='py-3 px-4 border-b'>순위</th>
              <th className='py-3 px-4 border-b'>상품명</th>
              <th className='py-3 px-4 border-b'>가격</th>
              <th className='py-3 px-4 border-b'>고유 구매자 수</th>
              <th className='py-3 px-4 border-b'>총 주문 수</th>
              <th className='py-3 px-4 border-b'>재구매율(%)</th>
            </tr>
          </thead>
          <tbody>
            {topRepurchaseItems.map((item, index) => (
              <tr key={item.itemNo} className='hover:bg-blue-50 transition-all duration-300'>
                <td className='py-3 px-4 border-b font-bold'>{index + 1}</td>
                <td className='py-3 px-4 border-b'>{item.itemName}</td>
                <td className='py-3 px-4 border-b text-green-600 font-semibold'>
                  {item.price.toLocaleString()}원
                </td>
                <td className='py-3 px-4 border-b'>{item.uniqueUserCount}</td>
                <td className='py-3 px-4 border-b'>{item.totalOrders}</td>
                <td className='py-3 px-4 border-b text-purple-600 font-bold'>
                  {item.repurchaseRate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RepurchaseAnalysisComponent
