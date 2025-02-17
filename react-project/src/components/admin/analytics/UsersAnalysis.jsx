import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

const UsersAnalysisComponent = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '쇼핑몰 분석' }, { name: '유저통계' }]
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await API.get('/admin/user-statistics')
        setStats(response.data.result.data)
      } catch (error) {
        console.error('유저 통계 조회 실패:', error)
      }
    }
    fetchUserStatistics()
  }, [])

  if (!stats) {
    return <div className='text-center p-6'>유저 통계 불러오는 중...</div>
  }

  // 성별 데이터 구성
  const genderData = Object.entries(stats.gender).map(([key, value]) => ({
    name: key === 'M' ? '남성' : '여성',
    value,
  }))

  // 연령대 데이터 구성
  const ageGroupData = Object.entries(stats.ageGroup).map(([key, value]) => ({
    name: key,
    count: value,
  }))

  // 등급 데이터 구성
  const gradeData = Object.entries(stats.grade).map(([key, value]) => ({
    grade: key,
    count: value,
  }))

  const COLORS = ['#4DB6AC', '#FF7043']

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>유저통계</h2>

      {/* 통계 요약 */}
      <div className='grid grid-cols-3 gap-6 mb-8'>
        <div className='bg-blue-100 p-6 rounded-lg shadow-md text-center'>
          <h3 className='text-lg font-bold mb-2'>전체 사용자</h3>
          <p className='text-3xl font-extrabold text-blue-700'>{stats.totalUsers}명</p>
        </div>
        <div className='bg-green-100 p-6 rounded-lg shadow-md text-center'>
          <h3 className='text-lg font-bold mb-2'>활성 사용자</h3>
          <p className='text-3xl font-extrabold text-green-700'>{stats.activeUsers}명</p>
        </div>
        <div className='bg-red-100 p-6 rounded-lg shadow-md text-center'>
          <h3 className='text-lg font-bold mb-2'>비활성 사용자</h3>
          <p className='text-3xl font-extrabold text-red-700'>{stats.inactiveUsers}명</p>
        </div>
      </div>

      {/* 성별 비율 */}
      <div className='mb-8 grid grid-cols-2 gap-6'>
        {/* 성별 카드 */}
        <div className='bg-white shadow-md rounded-lg p-4 border border-gray-300'>
          <h3 className='text-xl font-semibold mb-4 text-center'>🧑‍🤝‍🧑 성별 비율</h3>
          <div className='flex justify-center'>
            <PieChart width={300} height={300}>
              <Pie
                data={genderData}
                cx='50%'
                cy='50%'
                outerRadius={100}
                fill='#8884d8'
                dataKey='value'
                label={(entry) => entry.name}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* 연령대별 사용자 수 카드 */}
        <div className='bg-white shadow-md rounded-lg p-4 border border-gray-300'>
          <h3 className='text-xl font-semibold mb-4 text-center'>🎂 연령대별 사용자 수</h3>
          <div className='flex justify-center'>
            <BarChart width={400} height={300} data={ageGroupData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis label={{ value: '사용자 수', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey='count' fill='#82ca9d' name='사용자 수' />
            </BarChart>
          </div>
        </div>
      </div>

      {/* 등급별 사용자 수 */}
      <div className='mb-6'>
        <h3 className='text-xl font-semibold mb-4'>⭐ 등급별 사용자 수</h3>
        <table className='w-full border border-gray-300 text-center'>
          <thead className='bg-[#FFF3E0] text-[#3E2723]'>
            <tr>
              <th className='border px-4 py-2'>등급</th>
              <th className='border px-4 py-2'>사용자 수</th>
            </tr>
          </thead>
          <tbody>
            {gradeData.map((grade) => (
              <tr key={grade.grade} className='hover:bg-gray-100'>
                <td className='border px-4 py-2'>{grade.grade}</td>
                <td className='border px-4 py-2'>{grade.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersAnalysisComponent
