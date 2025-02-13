import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import LiveChat from './LiveChat.jsx'

const LiveStreamSetup = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true'
  const location = useLocation()
  const event = location.state?.event
  const videoRef = useRef(null)
  const wsRef = useRef(null) // 📌 스트리밍 서버 웹소켓 참조 추가
  const [stream, setStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [chatActive, setChatActive] = useState(false) // 📌 채팅 활성화 여부 추가

  // 📌 현재 시간
  const now = moment()
  const startAt = event?.startAt ? moment(event.startAt, 'YYYYMMDD HHmmss') : null
  const endAt = event?.endAt ? moment(event.endAt, 'YYYYMMDD HHmmss') : null
  const isLiveAvailable = startAt && endAt && now.isBetween(startAt, endAt)

  // 📌 방송 시작 / 중지 핸들러
  const handleStreamToggle = () => {
    console.log(`라이브 가능 여부: ${isLiveAvailable}, 디버그 모드: ${debug_mode}`)

    if (!isLiveAvailable && !debug_mode) {
      return
    }

    if (isStreaming) {
      setIsStreaming(false)
      setChatActive(false) // 📌 방송이 종료되면 채팅도 종료

      // 📌 스트리밍 웹소켓 종료
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: cameraOn, audio: micOn })
        .then((mediaStream) => {
          setStream(mediaStream)
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
          }
        })
        .catch((error) => console.error('미디어 장치를 가져오는 데 실패했습니다.', error))

      setIsStreaming(true)
      setChatActive(true) // 📌 방송 시작 시 채팅도 시작

      // 📌 스트리밍 서버 연결
      const baseWebSocketUrl = 'http://localhost:8080/ws/live'
      const streamKey = event?.id || 'defaultStreamKey'
      const broadcasterId = localStorage.getItem('user_id') || 'guest'
      const wsUrl = `${baseWebSocketUrl}?streamKey=${streamKey}&broadcaster=${broadcasterId}`

      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('🎥 스트리밍 서버 연결됨', wsUrl)
      }

      wsRef.current.onerror = () => {
        console.error('❌ 스트리밍 서버 연결 실패')
        setIsStreaming(false)
        setChatActive(false)
        wsRef.current = null
      }

      wsRef.current.onclose = () => {
        console.log('🎥 스트리밍 서버 연결 종료')
        setIsStreaming(false)
        setChatActive(false)
      }
    }
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-4'>라이브 방송 환경 설정</h1>

      {!isLiveAvailable && !debug_mode && (
        <div className='text-red-500 text-lg font-semibold mb-4'>
          🚫 라이브 방송은 {startAt?.format('YYYY-MM-DD HH:mm')} ~ {endAt?.format('HH:mm')} 동안에만
          가능합니다.
        </div>
      )}

      {/* 📌 방송 화면 미리보기 */}
      <div className='relative border rounded-lg shadow-md bg-black w-full mx-auto'>
        <video ref={videoRef} autoPlay playsInline className='w-full h-[500px] bg-black'></video>
      </div>

      {/* 📌 컨트롤 버튼 */}
      <div className='flex justify-center mt-4 space-x-4'>
        <button
          onClick={handleStreamToggle}
          className={`px-4 py-2 font-bold text-white rounded ${
            isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={!debug_mode && !isLiveAvailable}
        >
          {isStreaming ? '방송 중지' : '방송 시작'}
        </button>
      </div>

      {/* 📌 채팅 UI (방송이 켜진 경우에만) */}
      {chatActive && <LiveChat channelId={event?.id || 'defaultStreamKey'} />}
    </div>
  )
}

export default LiveStreamSetup
