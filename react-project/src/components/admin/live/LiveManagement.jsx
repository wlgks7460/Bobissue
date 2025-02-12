import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const LiveManagement = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 신청관리' },
  ]
  const navigate = useNavigate()

  // 현재 시점의 년-월 가져오기(YYYY-MM)
  const currentMonth = moment().format('YYYYMM')

  // 신청 목록을 저장할 state
  const [applications, setApplications] = useState([])

  const [loading, setLoading] = useState(true)

  // API 호출 하여 신청 목록 불러오기
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get('/cast') // 신청 목록 가져오기
        console.log('신청목록 데이터 :', response.data)

        // 응답 데이터에서 현재 월과 같은 항목만 필터링
        const filteredApplications =
          response.data?.result?.data.filter(
            (app) => moment(app.createAt, 'YYYYMMDD HHmmss').format('YYYYMM') === currentMonth,
          ) || []

        setApplications(filteredApplications)
      } catch (error) {
        console.error('신청 목록 불러오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const handleViewDetails = (castNo) => {
    navigate(`/admin/live/register/${castNo}`) // ✅ 상세 페이지로 이동
  }
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>라이브커머스 신청관리</h2>

      {/* 조회하는 시점의 월 기준으로 신청한 목록 */}
      <h2 className='text-lg font-bold mb-6'>✅{moment().format('M월')} 라이브 신청자 목록</h2>
      {loading ? (
        <p>📌 신청 목록을 불러오는 중...</p>
      ) : (
        <table className='table-auto w-full border'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-4 py-2'>판매자</th>
              <th className='border px-4 py-2'>방송 제목</th>
              <th className='border px-4 py-2'>방송 시작</th>
              <th className='border px-4 py-2'>방송 종료</th>
              <th className='border px-4 py-2'>작업</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.castNo}>
                  <td className='border px-4 py-2'>{app.createdUser.split(' ')[1]}</td>
                  <td className='border px-4 py-2'>{app.title}</td>
                  <td className='border px-4 py-2'>
                    {moment(app.startAt, 'YYYYMMDD HHmmss').format('MM월 DD일 HH시 mm분')}
                  </td>
                  <td className='border px-4 py-2'>
                    {moment(app.endAt, 'YYYYMMDD HHmmss').format('MM월 DD일 HH시 mm분')}
                  </td>

                  <td className='border px-4 py-2'>
                    <button
                      onClick={() => handleViewDetails(app.castNo)}
                      className='bg-gray-500 text-white px-3 py-1 rounded'
                    >
                      상세조회
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='text-center py-4'>
                  신청된 라이브가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* 각 목록의 이메일 리스트 엑셀로 다운로드 로직 */}
      {/* 관리자가 상세 조회하여 정보 검토 후 차기 라이브 대상으로 "승인"한 목록 */}
      <h2 className='text-lg font-bold mb-6'>O월 라이브 승인 목록</h2>

      {/* 관리자가 상세 조회하여 정보 검토 후 차기 라이브 대상으로 "반려"한 목록 */}
      <h2 className='text-lg font-bold mb-6'>O월 라이브 반려 목록</h2>
    </div>
  )
}
export default LiveManagement
