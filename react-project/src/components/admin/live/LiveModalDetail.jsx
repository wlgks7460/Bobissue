import React from 'react'
import moment from 'moment'

const LiveDetailModal = ({ broadcast, onClose }) => {
  if (!broadcast) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div
        className='bg-white p-8 rounded-lg shadow-lg'
        style={{
          width: '60%', // ✅ 가로 크기 조절 (기본 60%)
          maxWidth: '800px', // ✅ 최대 크기 제한
          height: 'auto', // ✅ 세로 크기 자동 조절
          maxHeight: '90vh', // ✅ 최대 높이 설정 (뷰포트 기준)
          overflowY: 'auto', // ✅ 스크롤 가능하도록 설정
        }}
      >
        <h3 className='text-xl font-bold mb-4'>📢 방송 상세 정보</h3>
        <p>
          <strong>방송 제목:</strong> {broadcast.title}
        </p>
        <p>
          <strong>설명:</strong> {broadcast.content}
        </p>
        <p>
          <strong>방송 시간:</strong>{' '}
          {moment(broadcast.startAt, 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm')} ~{' '}
          {moment(broadcast.endAt, 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm')}
        </p>
        <p>
          <strong>판매자:</strong> {broadcast.createdUser.split(' ')[1]}
        </p>
        <p
          className='inline-block px-3 py-1 rounded-md text-black-100 mr-2'
          style={{
            backgroundColor:
              broadcast.castStatus === '대기'
                ? '#FDE68A'
                : broadcast.castStatus === '방송중'
                  ? '#A7F3D0'
                  : '#D1D5DB',
          }}
        >
          <strong>상태:</strong> {broadcast.castStatus}
        </p>

        {/* 닫기 버튼 */}
        <button onClick={onClose} className='mt-4 px-4 py-2 bg-gray-600 text-white rounded'>
          닫기
        </button>
      </div>
    </div>
  )
}

export default LiveDetailModal
