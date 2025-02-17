import { useEffect, useState } from 'react'
import API from '@/utils/API'

const Demographics = () => {
  const [data, setData] = useState(null)
  const [params, setParams] = useState(null) // `null`이면 서버가 자동으로 YEARLY 반환
  const [selectedAge, setSelectedAge] = useState(null) // 선택된 연령 그룹
  const [selectedGender, setSelectedGender] = useState(null) // 선택된 성별

  async function fetchDemographic() {
    try {
      const validParams = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']
      const queryParams = validParams.includes(params) ? { type: params } : {}

      const response = await API.get(`/sellers/statistics/demographic`, { params: queryParams })
      console.log(`📊 Fetching Data (${params || 'YEARLY'} Mode):`, response.data)

      if (!response?.data?.result?.data) {
        throw new Error('Invalid API Response Structure')
      }

      setData(response.data.result.data) // ✅ 데이터 저장
    } catch (err) {
      setData(null)
      console.error('❌ Fetch Error:', err.message)
    }
  }

  useEffect(() => {
    fetchDemographic()
  }, [params])

  console.log('📊 Processed Data:', data)

  // ✅ 연령, 성별 필터링
  const filteredData = () => {
    if (!data) return null

    // ✅ 연령 + 성별 선택 시 `combinedStats` 사용
    if (selectedAge && selectedGender) {
      return data.combinedStats[selectedAge]?.[selectedGender] || null
    }

    // ✅ 연령만 선택 시 `ageStats` 사용
    if (selectedAge) {
      return data.ageStats[selectedAge] || null
    }

    // ✅ 성별만 선택 시 `genderStats` 사용
    if (selectedGender) {
      return data.genderStats[selectedGender] || null
    }

    return null
  }

  const displayData = filteredData()

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <h1 className='text-xl font-bold text-deepCobalt'>연령/성별 통계</h1>

      {/* ✅ 기간 선택 버튼 */}
      <div className='flex space-x-4 mt-4'>
        {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map((type) => (
          <button
            key={type}
            onClick={() => setParams(type)}
            className={`px-4 py-2 rounded-lg transition ${
              params === type
                ? 'bg-deepCobalt text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ✅ 연령 필터 */}
      <div className='flex space-x-4 mt-4'>
        {['20대 미만', '20대', '30대', '40대', '50대 이상'].map((age) => (
          <button
            key={age}
            onClick={() => setSelectedAge(age === selectedAge ? null : age)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedAge === age
                ? 'bg-deepCobalt text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {age}
          </button>
        ))}
      </div>

      {/* ✅ 성별 필터 */}
      <div className='flex space-x-4 mt-4'>
        {[
          { value: 'M', label: '남성' },
          { value: 'F', label: '여성' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedGender(value === selectedGender ? null : value)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedGender === value
                ? 'bg-deepCobalt text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ✅ 데이터 출력 */}
      {displayData ? (
        <div className='mt-6 p-4 bg-gray-100 rounded-md'>
          <h2 className='text-lg font-semibold text-deepCobalt'>선택된 데이터</h2>
          <p className='mt-2 text-sm text-gray-700'>
            <strong>총 주문 수:</strong> {displayData.totalOrders}
          </p>
          <p className='text-sm text-gray-700'>
            <strong>총 매출:</strong> {displayData.totalRevenue.toLocaleString()}원
          </p>
          <p className='text-sm text-gray-700'>
            <strong>평균 주문 금액:</strong> {displayData.averageOrderAmount.toLocaleString()}원
          </p>

          {/* ✅ 카테고리별 주문 수 */}
          <h3 className='mt-4 text-md font-medium text-deepCobalt'>상위 카테고리</h3>
          <ul className='list-disc pl-5 text-sm text-gray-700'>
            {displayData.topCategories.map((category) => (
              <li key={category.categoryNo}>
                {category.categoryName} - 주문 수: {category.orderCount}, 매출:{' '}
                {category.totalRevenue.toLocaleString()}원
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className='text-gray-500 mt-4'>필터를 선택하여 데이터를 확인하세요.</p>
      )}
    </div>
  )
}

export default Demographics
