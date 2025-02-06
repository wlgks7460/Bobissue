import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '@/utils/API'

const LiveHome = ({ debug_mode = true }) => {
  const [liveStreams, setLiveStreams] = useState([])

  useEffect(() => {
    const fetchLiveStreams = async () => {
      if (debug_mode) {
        // 디버그 모드: 더미 데이터 사용
        const dummyLiveStreams = [
          {
            id: 1,
            title: '가을 패션 쇼핑 라이브',
            thumbnail: 'https://example.com/live1.jpg',
            host: '쇼핑 호스트 A',
          },
          {
            id: 2,
            title: '가전제품 특별 할인 방송',
            thumbnail: 'https://example.com/live2.jpg',
            host: '쇼핑 호스트 B',
          },
          {
            id: 3,
            title: '뷰티 & 코스메틱 라이브',
            thumbnail: 'https://example.com/live3.jpg',
            host: '메이크업 아티스트 C',
          },
        ]
        setLiveStreams(dummyLiveStreams)
      } else {
        // 실제 API에서 라이브 방송 목록 가져오기
        try {
          const response = await API.get('/api/live/ongoing')
          setLiveStreams(response.data.result)
        } catch (error) {
          console.error('라이브 방송 목록 불러오기 실패:', error)
        }
      }
    }

    fetchLiveStreams()
  }, [debug_mode])

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-6'>🎥 현재 진행 중인 라이브</h1>
      {liveStreams.length > 0 ? (
        <div className='grid grid-cols-3 gap-4'>
          {liveStreams.map((live) => (
            <Link
              to={`/live/${live.id}`}
              key={live.id}
              className='relative border p-4 rounded-lg shadow-md hover:shadow-lg transition'
            >
              <img
                src={live.thumbnail}
                alt={live.title}
                className='w-full h-40 object-cover rounded-lg'
              />
              <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded'>
                🔴 LIVE
              </div>
              <h2 className='font-semibold text-lg mt-2'>{live.title}</h2>
              <p className='text-gray-600'>{live.host}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 mt-6'>현재 진행 중인 라이브 방송이 없습니다.</p>
      )}
    </div>
  )
}

export default LiveHome
