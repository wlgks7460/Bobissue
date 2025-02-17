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
  }, [params, selectedAge, selectedGender]) // ✅ `selectedAge`, `selectedGender` 변경 시 API 요청

  console.log('📊 Processed Data:', data)

  // ✅ 연령, 성별 필터링
  const filteredData = () => {
    if (!data) return null

    // ✅ 연령 전체(`ALL_AGE_GROUPS`) + 성별 전체(`A`) 선택 시 `combinedStats` 전체 데이터 합산
    if (selectedAge === 'ALL_AGE_GROUPS' && selectedGender === 'A') {
      return Object.entries(data.combinedStats).reduce(
        (acc, [ageGroup, genderData]) => {
          Object.entries(genderData).forEach(([gender, stats]) => {
            acc.totalOrders += stats.totalOrders
            acc.totalRevenue += stats.totalRevenue
            acc.averageOrderAmount += stats.averageOrderAmount

            // ✅ 카테고리별 합산
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

    // ✅ 연령 + 성별 선택 시 `combinedStats` 사용
    if (
      selectedAge &&
      selectedGender &&
      selectedAge !== 'ALL_AGE_GROUPS' &&
      selectedGender !== 'A'
    ) {
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

    // ✅ 연령 전체 선택 시 `ageStats` 사용
    if (selectedAge === 'ALL_AGE_GROUPS') {
      if (selectedGender === 'M' || selectedGender === 'F') {
        return Object.entries(data.combinedStats)
          .map(([ageGroup, genderData]) => ({
            ageGroup,
            ...genderData[selectedGender], // 선택된 성별만 가져오기
          }))
          .filter((entry) => entry.totalOrders > 0) // 주문 수가 0 이상인 데이터만 반환
      } else {
        return Object.values(data.ageStats).map((ageGroup) => ({
          ageGroup: ageGroup.ageGroup,
          ...ageGroup,
        }))
      }
    }

    // ✅ 성별 전체 선택 시 `genderStats` 사용 (남성 + 여성 합산)
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

    // ✅ 연령만 선택 시 `ageStats` 사용
    if (selectedAge) {
      return data.ageStats[selectedAge]
        ? [{ ...data.ageStats[selectedAge], ageGroup: selectedAge }]
        : []
    }

    // ✅ 성별만 선택 시 `genderStats` 사용
    if (selectedGender) {
      return data.genderStats[selectedGender]
        ? [{ ...data.genderStats[selectedGender], gender: selectedGender }]
        : []
    }

    return []
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
        {['ALL_AGE_GROUPS', '20대 미만', '20대', '30대', '40대', '50대 이상'].map((age) => (
          <button
            key={age}
            onClick={() => setSelectedAge(age === selectedAge ? null : age)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedAge === age
                ? 'bg-deepCobalt text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {age === 'ALL_AGE_GROUPS' ? '전체' : age}
          </button>
        ))}
      </div>

      {/* ✅ 성별 필터 */}
      <div className='flex space-x-4 mt-4'>
        {[
          { value: 'A', label: '전체' },
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
    </div>
  )
}

export default Demographics
