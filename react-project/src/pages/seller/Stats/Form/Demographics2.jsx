import { useEffect, useState } from 'react'
import API from '@/utils/API'

const Demographics = ({ selectedPeriod }) => {
  const [data, setData] = useState(null)
  const [selectedAge, setSelectedAge] = useState(null)
  const [selectedGender, setSelectedGender] = useState(null)

  useEffect(() => {
    async function fetchDemographic() {
      try {
        const response = await API.get(`/sellers/statistics/demographic`)
        if (!response?.data?.result?.data) {
          throw new Error('Invalid API Response Structure')
        }
        setData(response.data.result.data)
      } catch (err) {
        setData(null)
        console.error('❌ Fetch Error:', err.message)
      }
    }
    fetchDemographic()
  }, []) // ✅ 빈 배열을 넣어 최초 한 번만 호출되도록 함

  const filteredData = () => {
    if (!data) return []

    if (selectedAge === 'ALL_AGE_GROUPS' && selectedGender === 'A') {
      return Object.entries(data.combinedStats).reduce(
        (acc, [ageGroup, genderData]) => {
          Object.values(genderData).forEach((stats) => {
            acc.totalOrders += stats.totalOrders
            acc.totalRevenue += stats.totalRevenue
            acc.averageOrderAmount += stats.averageOrderAmount
            stats.topCategories.forEach((category) => {
              const existingCategory = acc.topCategories.find(
                (c) => c.categoryNo === category.categoryNo,
              )
              if (existingCategory) {
                existingCategory.orderCount += category.orderCount
                existingCategory.totalRevenue += category.totalRevenue
              } else {
                acc.topCategories.push({ ...category })
              }
            })
          })
          return acc
        },
        { totalOrders: 0, totalRevenue: 0, averageOrderAmount: 0, topCategories: [] },
      )
    }

    if (selectedAge && selectedGender) {
      return data.combinedStats[selectedAge]?.[selectedGender]
        ? [
            {
              ...data.combinedStats[selectedAge][selectedGender],
              ageGroup: selectedAge,
              gender: selectedGender,
            },
          ]
        : []
    }

    if (selectedAge === 'ALL_AGE_GROUPS') {
      return selectedGender === 'M' || selectedGender === 'F'
        ? Object.entries(data.combinedStats)
            .map(([ageGroup, genderData]) => ({ ageGroup, ...genderData[selectedGender] }))
            .filter((entry) => entry.totalOrders > 0)
        : Object.values(data.ageStats).map((ageGroup) => ({
            ageGroup: ageGroup.ageGroup,
            ...ageGroup,
          }))
    }

    if (selectedGender === 'A') {
      return ['M', 'F'].map((gender) => ({
        gender,
        ...(data.genderStats[gender] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderAmount: 0,
          topCategories: [],
        }),
      }))
    }

    if (selectedAge)
      return data.ageStats[selectedAge]
        ? [{ ...data.ageStats[selectedAge], ageGroup: selectedAge }]
        : []
    if (selectedGender)
      return data.genderStats[selectedGender]
        ? [{ ...data.genderStats[selectedGender], gender: selectedGender }]
        : []

    return []
  }

  const displayData = filteredData()

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <h1 className='text-xl font-bold text-deepCobalt'>연령/성별 통계</h1>

      <div className='flex space-x-4 mt-4'>
        {['ALL_AGE_GROUPS', '20대 미만', '20대', '30대', '40대', '50대 이상'].map((age) => (
          <button
            key={age}
            onClick={() => setSelectedAge(age === selectedAge ? null : age)}
            className={`px-4 py-2 rounded-lg transition ${selectedAge === age ? 'bg-caramelTan/60 text-white' : 'bg-gray-200 hover:bg-caramelTan/50'}`}
          >
            {age === 'ALL_AGE_GROUPS' ? '전체' : age}
          </button>
        ))}
      </div>

      <div className='flex space-x-4 mt-4'>
        {[
          { value: 'A', label: '전체' },
          { value: 'M', label: '남성' },
          { value: 'F', label: '여성' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedGender(value === selectedGender ? null : value)}
            className={`px-4 py-2 rounded-lg transition ${selectedGender === value ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {displayData.length > 0 ? (
        <div className='mt-6 p-4 bg-gray-100 rounded-md'>
          <h2 className='text-lg font-semibold text-deepCobalt'>선택된 데이터</h2>
          {displayData.map((item, index) => (
            <div key={index} className='border-b pb-3 mb-3 last:border-none'>
              {item.ageGroup && (
                <p className='text-sm text-gray-700'>
                  <strong>연령:</strong> {item.ageGroup}
                </p>
              )}
              {item.gender && (
                <p className='text-sm text-gray-700'>
                  <strong>성별:</strong> {item.gender === 'M' ? '남성' : '여성'}
                </p>
              )}
              <p className='text-sm text-gray-700'>
                <strong>총 주문 수:</strong> {item.totalOrders}
              </p>
              <p className='text-sm text-gray-700'>
                <strong>총 매출:</strong> {item.totalRevenue?.toLocaleString() || 0}원
              </p>
              <p className='text-sm text-gray-700'>
                <strong>평균 주문 금액:</strong> {item.averageOrderAmount?.toLocaleString() || 0}원
              </p>
              {item.topCategories.length > 0 && (
                <div>
                  <h3 className='mt-2 text-md font-medium text-deepCobalt'>상위 카테고리</h3>
                  <ul className='list-disc pl-5 text-sm text-gray-700'>
                    {item.topCategories.map((category) => (
                      <li key={category.categoryNo}>
                        {category.categoryName} - 주문 수: {category.orderCount}, 매출:{' '}
                        {category.totalRevenue?.toLocaleString() || 0}원
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 mt-4'>필터를 선택하여 데이터를 확인하세요.</p>
      )}
    </div>
  )
}

export default Demographics
