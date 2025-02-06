import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '@/utils/API'

const LiveStream = () => {
  const { liveId } = useParams() // URL에서 라이브 ID 가져오기
  const [liveData, setLiveData] = useState(null)

  useEffect(() => {
    const fetchLiveDetails = async () => {
      try {
        const response = await API.get(`/api/live/${liveId}`)
        setLiveData(response.data.result) // 라이브 방송 데이터 저장
      } catch (error) {
        console.error('라이브 방송 정보를 불러오는 데 실패했습니다.', error)
      }
    }

    fetchLiveDetails()
  }, [liveId])

  if (!liveData) return <p className='text-center mt-6 text-gray-500'>로딩 중...</p>

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-4'>{liveData.title}</h1>
      <div className='aspect-w-16 aspect-h-9'>
        <iframe
          src={liveData.streamUrl}
          title='Live Stream'
          className='w-full h-96'
          allowFullScreen
        ></iframe>
      </div>
      <p className='mt-4 text-gray-700'>{liveData.description}</p>
      <p className='mt-2 text-sm text-gray-500'>호스트: {liveData.host}</p>
    </div>
  )
}

export default LiveStream
