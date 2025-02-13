import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

const LiveManagement = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 신청관리' },
  ]

  const navigate = useNavigate()
  const currentMonth = moment().format('YYYYMM')

  const [applications, setApplications] = useState([]) // 신청 목록 (등록)
  const [approvedApplications, setApprovedApplications] = useState([]) // 승인 목록 (대기)
  const [rejectedApplications, setRejectedApplications] = useState([]) // 거절 목록 (거절)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get('/cast')
        console.log('📌 신청목록 데이터:', response.data)

        const filteredApplications =
          response.data?.result?.data.filter(
            (app) => moment(app.createAt, 'YYYYMMDD HHmmss').format('YYYYMM') === currentMonth,
          ) || []

        // ✅ 상태별로 분류 (등록 / 대기 / 거절)
        setApplications(filteredApplications.filter((app) => app.castStatus === '등록')) // 신청 목록
        setApprovedApplications(filteredApplications.filter((app) => app.castStatus === '대기')) // 승인 목록
        setRejectedApplications(filteredApplications.filter((app) => app.castStatus === '거절')) // 거절 목록
      } catch (error) {
        console.error('❌ 신청 목록 불러오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const handleViewDetails = (castNo) => {
    navigate(`/admin/live/register/${castNo}`)
  }

  // ✅ 승인 처리 (PATCH 요청)
  const handleApprove = async (castNo) => {
    try {
      await API.patch(`/cast/${castNo}/register`)
      alert('승인 완료!')
      window.location.reload() // 페이지 새로고침하여 목록 업데이트
    } catch (error) {
      console.error('❌ 승인 실패:', error)
    }
  }

  // ❌ 반려 처리 (PATCH 요청)
  const handleReject = async (castNo) => {
    try {
      await API.patch(`/cast/${castNo}/refusal`)
      alert('반려 완료!')
      window.location.reload() // 페이지 새로고침하여 목록 업데이트
    } catch (error) {
      console.error('❌ 반려 실패:', error)
    }
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>라이브커머스 신청관리</h2>

      {/* ✅ 신청 목록 */}
      <h2 className='text-lg font-bold mb-6'>✅ {moment().format('M월')} 라이브 신청자 목록</h2>
      <TableComponent
        data={applications}
        handleViewDetails={handleViewDetails}
        handleApprove={handleApprove}
        handleReject={handleReject}
        showActions={true}
        emptyMessage='신청된 라이브가 없습니다.'
      />

      {/* ✅ 승인된 목록 */}
      <h2 className='text-lg font-bold mt-10 mb-6'>✅ {moment().format('M월')} 라이브 승인 목록</h2>
      <TableComponent
        data={approvedApplications}
        handleViewDetails={handleViewDetails}
        showActions={false}
        emptyMessage='승인된 라이브가 없습니다.'
      />

      {/* ❌ 거절된 목록 */}
      <h2 className='text-lg font-bold mt-10 mb-6'>❌ {moment().format('M월')} 라이브 반려 목록</h2>
      <TableComponent
        data={rejectedApplications}
        handleViewDetails={handleViewDetails}
        showActions={false}
        emptyMessage='거절된 라이브가 없습니다.'
      />
    </div>
  )
}

// ✅ 공통 테이블 컴포넌트
const TableComponent = ({
  data,
  handleViewDetails,
  handleApprove,
  handleReject,
  showActions,
  emptyMessage,
}) => (
  <table className='table-auto w-full border'>
    <thead>
      <tr className='bg-gray-100'>
        <th className='border px-4 py-2'></th> {/* 신청번호 추가 */}
        <th className='border px-4 py-2'>판매자</th>
        <th className='border px-4 py-2'>방송 제목</th>
        <th className='border px-4 py-2'>방송 시작</th>
        <th className='border px-4 py-2'>방송 종료</th>
        <th className='border px-4 py-2'>신청자료</th>
        {showActions && <th className='border px-4 py-2'>승인/반려</th>} {/* 승인/반려 버튼 컬럼 */}
      </tr>
    </thead>
    <tbody>
      {data.map((app, index) => (
        <tr key={app.castNo}>
          <td className='border px-4 py-2 text-center'>{index + 1}</td> {/* 신청번호 */}
          <td className='border px-4 py-2 text-center'>{app.createdUser.split(' ')[1]}</td>
          <td className='border px-4 py-2 text-center'>{app.title}</td>
          <td className='border px-4 py-2 text-center'>
            {moment(app.startAt, 'YYYYMMDD HHmmss').format('MM월 DD일 HH시 mm분')}
          </td>
          <td className='border px-4 py-2 text-center'>
            {moment(app.endAt, 'YYYYMMDD HHmmss').format('MM월 DD일 HH시 mm분')}
          </td>
          <td className='border px-4 py-2 text-center'>
            <button
              onClick={() => handleViewDetails(app.castNo)}
              className='bg-transparent text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50'
            >
              <Search size={20} strokeWidth={2} />
            </button>
          </td>
          {showActions && (
            <td className='border px-4 py-2 text-center'>
              <button
                onClick={() => handleApprove(app.castNo)}
                className='bg-blue-500 text-white px-3 py-1 rounded mr-2 text-center'
              >
                승인
              </button>
              <button
                onClick={() => handleReject(app.castNo)}
                className='bg-red-500 text-white px-3 py-1 rounded text-center'
              >
                반려
              </button>
            </td>
          )}
        </tr>
      ))}
      {data.length === 0 && ( // ⬅️ 여기가 핵심 (불필요한 공백 제거)
        <tr>
          <td colSpan={showActions ? '7' : '6'} className='text-center py-4'>
            {emptyMessage}
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

export default LiveManagement
