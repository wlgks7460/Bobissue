import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { useParams } from 'react-router-dom'
import API from '../../../utils/API'
import moment from 'moment'

const LiveRegisterDetail = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 신청관리' },
    { name: '라이브커머스 신청 상세' },
  ]
  const { castNo } = useParams() // URL 에서 castNo 가져오기
  const [liveDetail, setLiveDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  // 상세 데이터 가져오기
  useEffect(() => {
    const fetchLiveDetail = async () => {
      try {
        const response = await API.get(`/cast/${castNo}`)
        console.log('📢 상세 조회 응답 데이터:', response.data)
        setLiveDetail(response.data?.result?.data) // ✅ result.data에 접근
      } catch (error) {
        console.error('❌ 상세 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveDetail()
  }, [castNo])
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>📅 라이브커머스 신청 상세</h2>
      {loading ? (
        <p>📌 데이터를 불러오는 중...</p>
      ) : liveDetail ? (
        <div className='border p-4 rounded-lg shadow-lg bg-white'>
          {/* ✅ 기본 정보 */}
          <div className='mb-4'>
            <p className='text-lg font-semibold'>📢 방송 제목: {liveDetail.title}</p>
            <p className='text-gray-600'>📍 설명: {liveDetail.content}</p>
            <p className='text-gray-600'>👤 판매자: {liveDetail.createdUser.split(' ')[1]}</p>
            <p className='text-gray-600'>
              📺 방송 상태: <span className='font-bold'>{liveDetail.castStatus}</span>
            </p>
          </div>

          {/* ✅ 방송 일정 */}
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>📆 방송 일정</h3>
            <p>
              ⏰ 시작 시간:{' '}
              {moment(liveDetail.startAt, 'YYYYMMDD HHmmss').format('MM월 DD일 HH시 mm분')}
            </p>
            <p>
              ⏰ 종료 시간:{' '}
              {moment(liveDetail.endAt, 'YYYYMMDD HHmmss').format('MM월 DD일 HH시 mm분')}
            </p>
          </div>

          {/* ✅ 방송 메타데이터 */}
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>📝 방송 메타데이터</h3>
            <p>
              🛠 생성일:{' '}
              {moment(liveDetail.createAt, 'YYYYMMDD HHmmss').format('YYYY년 MM월 DD일 HH시 mm분')}
            </p>
            <p>
              ✏️ 최근 수정:{' '}
              {moment(liveDetail.updatedAt, 'YYYYMMDD HHmmss').format('YYYY년 MM월 DD일 HH시 mm분')}
            </p>
            <p>🔄 수정한 사용자: {liveDetail.updatedUser.split(' ')[1]}</p>
          </div>

          {/* ✅ 판매할 상품 목록 */}
          <h3 className='text-lg font-semibold mt-6'>📦 판매할 상품 목록</h3>
          {liveDetail.castItemList && liveDetail.castItemList.length > 0 ? (
            <table className='table-auto w-full border mt-2'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>상품명</th>
                  <th className='border px-4 py-2'>상품 설명</th>
                </tr>
              </thead>
              <tbody>
                {liveDetail.castItemList.map((item) => (
                  <tr key={item.itemNo}>
                    <td className='border px-4 py-2'>{item.name}</td>
                    <td className='border px-4 py-2'>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>📌 판매할 상품 정보가 없습니다.</p>
          )}
        </div>
      ) : (
        <p>❌ 데이터를 불러올 수 없습니다.</p>
      )}
    </div>
  )
}
export default LiveRegisterDetail
