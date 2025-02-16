import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const CategoryAnalysisComponent = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '쇼핑몰 분석' }, { name: '카테고리 분석' }]
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const response = await API.get('/admin/statistics/category')
        if (response.data.status === 'OK') {
          setCategoryData(response.data.result.data)
        } else {
          setError(response.data.message)
        }
      } catch (err) {
        setError('데이터 로딩 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryStats()
  }, [])

  const topCategory = categoryData.reduce(
    (prev, curr) => (curr.totalRevenue > prev.totalRevenue ? curr : prev),
    categoryData[0],
  )

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>카테고리 분석</h2>
        <div className='text-center text-gray-500'>데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>카테고리 분석</h2>
        <div className='text-center text-red-500'>{error}</div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>카테고리 분석</h2>

      {/* 네비게이션 탭 */}
      <div className='flex justify-center mb-6 border-b-2 border-gray-200'>
        {['최고 성과 카테고리', '전체 데이터', '차트'].map((tab, index) => (
          <button
            key={index}
            className='relative px-6 py-3 text-lg font-medium text-gray-700 hover:text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300'
            onClick={() =>
              scrollToSection(
                index === 0 ? 'top-category' : index === 1 ? 'category-table' : 'charts-section',
              )
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 최상단 최고 성과 카테고리 카드 */}
      <div id='top-category' className='bg-white p-4 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold mb-4'>최고 성과 카테고리</h3>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm text-center'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='border p-3 text-left'>카테고리명</th>
                <th className='border p-3 text-right'>총 매출(₩)</th>
                <th className='border p-3 text-right'>총 판매량(개)</th>
                <th className='border p-3 text-right'>상품 수(개)</th>
                <th className='border p-3 text-right'>평균 가격(₩)</th>
              </tr>
            </thead>
            <tbody>
              <tr className='hover:bg-gray-50'>
                <td className='border p-3 text-left'>{topCategory.categoryName}</td>
                <td className='border p-3 text-right'>
                  {topCategory.totalRevenue.toLocaleString()}
                </td>
                <td className='border p-3 text-right'>{topCategory.totalSales.toLocaleString()}</td>
                <td className='border p-3 text-right'>{topCategory.itemCount.toLocaleString()}</td>
                <td className='border p-3 text-right'>
                  {Math.round(topCategory.averagePrice).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 전체 카테고리 데이터 표 */}
      <div id='category-table' className='bg-white p-4 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold mb-4'>전체 카테고리별 데이터</h3>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm text-center'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='border p-3 text-left'>카테고리명</th>
                <th className='border p-3 text-right'>총 매출(₩)</th>
                <th className='border p-3 text-right'>총 판매량(개)</th>
                <th className='border p-3 text-right'>상품 수(개)</th>
                <th className='border p-3 text-right'>평균 가격(₩)</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item) => (
                <tr key={item.categoryNo} className='hover:bg-gray-50'>
                  <td className='border p-3 text-left'>{item.categoryName}</td>
                  <td className='border p-3 text-right'>{item.totalRevenue.toLocaleString()}</td>
                  <td className='border p-3 text-right'>{item.totalSales.toLocaleString()}</td>
                  <td className='border p-3 text-right'>{item.itemCount.toLocaleString()}</td>
                  <td className='border p-3 text-right'>
                    {Math.round(item.averagePrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 차트 영역 */}
      <div id='charts-section' className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>카테고리별 매출</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='categoryName' />
              <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
              <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
              <Bar dataKey='totalRevenue' fill='#4F46E5' name='매출' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>카테고리별 판매량</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='categoryName' />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()}개`} />
              <Bar dataKey='totalSales' fill='#0EA5E9' name='판매량' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>카테고리별 상품 수</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='categoryName' />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()}개`} />
              <Bar dataKey='itemCount' fill='#34D399' name='상품 수' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>카테고리별 평균 가격</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='categoryName' />
              <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
              <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
              <Bar dataKey='averagePrice' fill='#F59E0B' name='평균 가격' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default CategoryAnalysisComponent
