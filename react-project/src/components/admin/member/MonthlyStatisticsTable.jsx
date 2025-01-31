import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MonthlyStatisticsTable = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '회원관리' },
    { name: '가입통계' },
    { name: '월별가입통계분석' },
  ]

  // 현재 날짜 계산
  const today = new Date()
<<<<<<< HEAD
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0') // 현재 월 (01, 02 형식)
  const currentYear = today.getFullYear().toString() // 현재 연도

  // 상태 관리
  const [startMonth, setStartMonth] = useState(`${currentYear}-01`) // 기본값: 1월
  const [endMonth, setEndMonth] = useState(`${currentYear}-${currentMonth}`) // 기본값: 현재 월
  const [monthlyData, setMonthlyData] = useState([]) // 전체 데이터
  const [filteredData, setFilteredData] = useState([]) // 필터링된 데이터
  const [isLoading, setIsLoading] = useState(true)

  // 모든 월 생성 (2025-01부터 현재 월까지)
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0')
    return `${currentYear}-${month}`
  })
=======
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0')
  const currentYear = today.getFullYear().toString()

  // 상태 관리
  const [startMonth, setStartMonth] = useState(`${currentYear}-${currentMonth}`) // 기본값: 현재 월
  const [endMonth, setEndMonth] = useState(`${currentYear}-${currentMonth}`) // 기본값: 현재 월
  const [monthlyData, setMonthlyData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // 두 날짜 사이의 모든 월을 생성하는 함수
  const generateMonthRange = (start, end) => {
    const months = []
    const [startYear, startMonth] = start.split('-').map(Number)
    const [endYear, endMonth] = end.split('-').map(Number)

    let currentYear = startYear
    let currentMonth = startMonth

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      months.push(`${currentYear}-${currentMonth.toString().padStart(2, '0')}`)

      currentMonth++
      if (currentMonth > 12) {
        currentMonth = 1
        currentYear++
      }
    }

    return months
  }
>>>>>>> develop

  // 회원 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/users')
        const data = response.data.result.data

        // 월별 가입 통계 계산
        const monthlyCounts = {}
        data.forEach((user) => {
<<<<<<< HEAD
          const rawDate = user.createAt // 예: '20250127100000'
          const yearMonth = rawDate.slice(0, 6) // '202501'
          const formattedMonth = `${yearMonth.slice(0, 4)}-${yearMonth.slice(4, 6)}` // '2025-01'
          monthlyCounts[formattedMonth] = (monthlyCounts[formattedMonth] || 0) + 1
        })

        // 월별 데이터 배열로 변환
=======
          const rawDate = user.createAt
          const yearMonth = rawDate.slice(0, 6)
          const formattedMonth = `${yearMonth.slice(0, 4)}-${yearMonth.slice(4, 6)}`
          monthlyCounts[formattedMonth] = (monthlyCounts[formattedMonth] || 0) + 1
        })

>>>>>>> develop
        const monthlyDataArray = Object.entries(monthlyCounts).map(([month, count]) => ({
          month,
          count,
        }))

        setMonthlyData(monthlyDataArray)
        setIsLoading(false)
      } catch (error) {
        console.error('데이터 불러오기 오류:', error)
        alert('회원 데이터를 불러오는 데 실패했습니다.')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 기간별 데이터 필터링
  useEffect(() => {
    if (startMonth && endMonth) {
<<<<<<< HEAD
      const filtered = allMonths.map((month) => {
        const data = monthlyData.find((entry) => entry.month === month)
        return { month, count: data ? data.count : 0 } // 데이터 없으면 count = 0
      })
      setFilteredData(
        filtered.filter((entry) => entry.month >= startMonth && entry.month <= endMonth),
      )
    }
  }, [startMonth, endMonth, monthlyData, allMonths])

  // 그래프 데이터 구성
  const chartData = {
    labels: filteredData.map((data) => data.month), // x축: 모든 월
    datasets: [
      {
        label: '가입 수',
        data: filteredData.map((data) => data.count), // y축: 가입 수
=======
      // 선택된 기간의 모든 월 생성
      const monthRange = generateMonthRange(startMonth, endMonth)

      // 각 월에 대해 데이터 매핑 (없으면 0)
      const monthlyDataMap = new Map(monthlyData.map((item) => [item.month, item.count]))

      const filtered = monthRange.map((month) => ({
        month,
        count: monthlyDataMap.get(month) || 0,
      }))

      setFilteredData(filtered)
    }
  }, [startMonth, endMonth, monthlyData])

  // 그래프 데이터 구성
  const chartData = {
    labels: filteredData.map((data) => data.month),
    datasets: [
      {
        label: '가입 수',
        data: filteredData.map((data) => data.count),
>>>>>>> develop
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
<<<<<<< HEAD
            size: 12, // x축 폰트 크기 조정
=======
            size: 12,
>>>>>>> develop
          },
        },
      },
      y: {
        ticks: {
          font: {
<<<<<<< HEAD
            size: 12, // y축 폰트 크기 조정
=======
            size: 12,
>>>>>>> develop
          },
        },
        beginAtZero: true,
      },
    },
<<<<<<< HEAD
    animation: false, // 애니메이션 비활성화
=======
    animation: false,
>>>>>>> develop
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>월별 가입 통계 분석</h2>

<<<<<<< HEAD
      {/* 기간 선택 */}
=======
>>>>>>> develop
      <div className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>시작 월</label>
          <input
            type='month'
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>종료 월</label>
          <input
            type='month'
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
          />
        </div>
      </div>

<<<<<<< HEAD
      {/* 통계 테이블 */}
=======
>>>>>>> develop
      <table className='table-auto w-full border mb-6'>
        <thead>
          <tr>
            <th className='border p-2'>월</th>
            <th className='border p-2'>가입 수</th>
          </tr>
        </thead>
        <tbody>
<<<<<<< HEAD
          {filteredData.length > 0 ? (
=======
          {isLoading ? (
            <tr>
              <td className='border p-2 text-center' colSpan='2'>
                데이터를 불러오는 중...
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
>>>>>>> develop
            filteredData.map((data) => (
              <tr key={data.month}>
                <td className='border p-2 text-center'>{data.month}</td>
                <td className='border p-2 text-center'>{data.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className='border p-2 text-center' colSpan='2'>
<<<<<<< HEAD
                데이터가 없습니다.
=======
                선택한 기간의 데이터가 없습니다.
>>>>>>> develop
              </td>
            </tr>
          )}
        </tbody>
      </table>

<<<<<<< HEAD
      {/* 통계 그래프 */}
=======
>>>>>>> develop
      {!isLoading && filteredData.length > 0 && (
        <div className='mb-6' style={{ height: '300px', width: '50%' }}>
          <h3 className='text-lg font-semibold mb-4'>가입 통계 그래프</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  )
}

export default MonthlyStatisticsTable
