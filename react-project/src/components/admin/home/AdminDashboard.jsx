// 현재 대시보드는 데이터가 없으므로 예시임 !!
// 생성형 ai 가 만들어준 데이터로 만든 차트
import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const AdminDashBoard = () => {
  // 막대 그래프 데이터
  const barData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        label: '월별 방문자 수',
        data: [1200, 1900, 1700, 2200, 2400],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  // 원형 그래프 데이터
  const doughnutData = {
    labels: ['유료 사용자', '무료 사용자'],
    datasets: [
      {
        label: '사용자 비율',
        data: [700, 530],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-4 mt-4'>대시보드(예시)</h1>

      {/* 카드 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-base font-semibold text-gray-800'>총 사용자</h2>
          <p className='text-3xl font-bold text-blue-600 mt-1'>1,234</p>
        </div>

        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-base font-semibold text-gray-800'>오늘의 방문자</h2>
          <p className='text-3xl font-bold text-blue-600 mt-1'>567</p>
        </div>

        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-base font-semibold text-gray-800'>총 매출</h2>
          <p className='text-3xl font-bold text-blue-600 mt-1'>₩12,345,678</p>
        </div>
      </div>

      {/* 그래프 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        {/* 원형 그래프 */}
        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-base font-semibold text-gray-800 mb-4'>사용자 비율</h2>
          <Doughnut data={doughnutData} />
        </div>

        {/* 막대 그래프 */}
        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-base font-semibold text-gray-800 mb-4'>월별 방문자 수</h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard
