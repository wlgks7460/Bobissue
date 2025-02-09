import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'

const LiveStreamSetup = () => {
  const location = useLocation()
  const event = location.state?.event
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)

  // 📌 현재 날짜 및 시간 정보 가져오기
  const now = moment()
  const eventDate = moment(event?.date, 'YYYY-MM-DD')
  const eventStartTime = moment(`${event?.date}T${event?.time.split('-')[0]}`, 'YYYY-MM-DDTHH:mm')
  const eventEndTime = moment(eventStartTime).add(event?.duration || 60, 'minutes')

  // 📌 라이브 시작 가능 여부 체크 (현재 시간이 방송 시간 범위 안에 있어야 함)
  const isLiveAvailable = event && now.isBetween(eventStartTime, eventEndTime)

  // 📌 웹캠(미리보기) 설정 (방송 가능 여부와 무관하게 실행)
  useEffect(() => {
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

  // 📌 방송 시작 / 중지 토글 핸들러
  const handleStreamToggle = () => {
    if (!isLiveAvailable) return
    if (isStreaming) {
      stream.getTracks().forEach((track) => track.stop()) // 모든 미디어 트랙 중지
      setStream(null)
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
    }
    setIsStreaming(!isStreaming)
  }

  // 📌 마이크 On/Off 핸들러
  const handleMicToggle = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !micOn))
    }
    setMicOn(!micOn)
  }

  // 📌 카메라 On/Off 핸들러
  const handleCameraToggle = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !cameraOn))
    }
    setCameraOn(!cameraOn)
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-4'> 라이브 방송 환경 설정</h1>

      {/* 📌 라이브 가능 여부 메시지 */}
      {!isLiveAvailable && (
        <div className='text-red-500 text-lg font-semibold mb-4'>
          🚫 라이브 방송은 {event?.date} {event?.time} 동안에만 가능합니다.
        </div>
      )}

      {/* 📌 방송 화면 미리보기 (항상 가능) */}
      <div className='relative border p-4 rounded-lg shadow-md bg-black w-full max-w-3xl mx-auto'>
        <video ref={videoRef} autoPlay playsInline className='w-full h-[500px] bg-black'></video>
      </div>

      {/* 📌 컨트롤 버튼 */}
      <div className='flex justify-center mt-4 space-x-4'>
        {/* 🚫 방송 시작 / 중지 버튼 (라이브 가능할 때만 활성화) */}
        <button
          onClick={handleStreamToggle}
          className={`px-4 py-2 font-bold text-white rounded ${
            isLiveAvailable
              ? isStreaming
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isLiveAvailable}
        >
          {isStreaming ? '방송 중지' : '방송 시작'}
        </button>

        {/* 마이크 토글 (항상 활성화) */}
        <button
          onClick={handleMicToggle}
          className={`px-4 py-2 font-bold text-white rounded ${
            micOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {micOn ? '마이크 끄기' : '마이크 켜기'}
        </button>

        {/* 카메라 토글 (항상 활성화) */}
        <button
          onClick={handleCameraToggle}
          className={`px-4 py-2 font-bold text-white rounded ${
            cameraOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {cameraOn ? '카메라 끄기' : '카메라 켜기'}
        </button>
      </div>
    </div>
  )
}

export default LiveStreamSetup
