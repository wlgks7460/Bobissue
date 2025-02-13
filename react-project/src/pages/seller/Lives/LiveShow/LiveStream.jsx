import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'

const LiveStreamSetup = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true'
  const location = useLocation()
  const event = location.state?.event
  const videoRef = useRef(null)
  const wsRef = useRef(null) // 📌 웹소켓 참조 추가
  const [stream, setStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [messages, setMessages] = useState([]) // 📌 채팅 메시지 상태 추가
  const [inputMessage, setInputMessage] = useState('')

  // 📌 현재 시간
  const now = moment()

  // 📌 방송 시작/종료 시간 변환
  const startAt = event?.startAt ? moment(event.startAt, 'YYYYMMDD HHmmss') : null
  const endAt = event?.endAt ? moment(event.endAt, 'YYYYMMDD HHmmss') : null

  // 📌 라이브 시작 가능 여부 체크
  const isLiveAvailable = startAt && endAt && now.isBetween(startAt, endAt)

  // 📌 웹캠(미리보기) 설정
  useEffect(() => {
    console.log(debug_mode)
    const setupStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error('미디어 장치를 가져오는 데 실패했습니다.', error)
      }
    }

    setupStream()
  }, [])

  // 📌 방송 시작 / 중지 핸들러
  const handleStreamToggle = () => {
    console.log(`라이브 가능 여부: ${isLiveAvailable}, 디버그 모드: ${debug_mode}`)

    if (!isLiveAvailable && !debug_mode) {
      return
    }

    if (isStreaming) {
      setIsStreaming(false)

      // 📌 웹소켓 종료
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

      // 📌 웹소켓 연결
      wsRef.current = new WebSocket('wss://your-server-url.com/live') // 서버 URL 변경

      wsRef.current.onopen = () => {
        console.log('웹소켓 연결됨')
      }

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data)
        setMessages((prev) => [...prev, message]) // 📌 메시지를 리스트에 추가
      }

      wsRef.current.onerror = () => {
        console.error('웹소켓 연결 실패')
        setIsStreaming(false) // 📌 연결 실패 시 방송 중지 상태로 변경
        wsRef.current = null
      }

      wsRef.current.onclose = () => {
        console.log('웹소켓 연결 종료')
        setIsStreaming(false) // 📌 웹소켓이 예상치 않게 종료되면 방송 중지 상태로 변경
      }
    }
  }

  // 📌 마이크 토글
  const handleMicToggle = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !micOn))
    }
    setMicOn(!micOn)
  }

  // 📌 카메라 토글
  const handleCameraToggle = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !cameraOn))
    }
    setCameraOn(!cameraOn)
  }

  // 📌 채팅 메시지 전송
  const sendMessage = () => {
    if (wsRef.current && inputMessage.trim() !== '') {
      const messageData = { user: '방송자', text: inputMessage }
      wsRef.current.send(JSON.stringify(messageData))
      setMessages((prev) => [...prev, messageData])
      setInputMessage('')
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
          disabled={!debug_mode && !isLiveAvailable} // debug_mode가 true면 항상 활성화
        >
          {isStreaming ? '방송 중지' : '방송 시작'}
        </button>

        <button
          onClick={handleMicToggle}
          className={`px-4 py-2 font-bold text-white rounded ${
            micOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {micOn ? '마이크 끄기' : '마이크 켜기'}
        </button>

        <button
          onClick={handleCameraToggle}
          className={`px-4 py-2 font-bold text-white rounded ${
            cameraOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {cameraOn ? '카메라 끄기' : '카메라 켜기'}
        </button>
      </div>

      {/* 📌 채팅 UI */}
      <div className='mt-6 border p-4 rounded-lg shadow-md bg-gray-100 max-w-3xl mx-auto'>
        <h2 className='font-semibold text-lg mb-2'>실시간 채팅</h2>
        <div className='h-60 overflow-y-auto border p-2 bg-white rounded'>
          {messages.map((msg, idx) => (
            <div key={idx} className='p-2 border-b'>
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className='mt-2 flex'>
          <input
            className='flex-1 border p-2 rounded'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder='메시지를 입력하세요...'
          />
          <button onClick={sendMessage} className='ml-2 px-4 py-2 bg-blue-500 text-white rounded'>
            전송
          </button>
        </div>
      </div>
    </div>
  )
}

export default LiveStreamSetup
