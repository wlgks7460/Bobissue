import React, { useEffect, useRef, useState } from 'react'

const LiveStreamSetup = () => {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)

  // 📌 웹캠 및 마이크 설정
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
      <h1 className='font-bold text-[32px] mb-4'>🎥 라이브 방송 환경 설정</h1>

      {/* 📌 방송 화면 미리보기 */}
      <div className='relative border p-4 rounded-lg shadow-md bg-black w-full max-w-3xl mx-auto'>
        <video ref={videoRef} autoPlay playsInline className='w-full h-[500px] bg-black'></video>
      </div>

      {/* 📌 컨트롤 버튼 */}
      <div className='flex justify-center mt-4 space-x-4'>
        <button
          onClick={handleStreamToggle}
          className={`px-4 py-2 font-bold text-white rounded ${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isStreaming ? '방송 중지' : '방송 시작'}
        </button>
        <button
          onClick={handleMicToggle}
          className={`px-4 py-2 font-bold text-white rounded ${micOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
        >
          {micOn ? '마이크 끄기' : '마이크 켜기'}
        </button>
        <button
          onClick={handleCameraToggle}
          className={`px-4 py-2 font-bold text-white rounded ${cameraOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'}`}
        >
          {cameraOn ? '카메라 끄기' : '카메라 켜기'}
        </button>
      </div>
    </div>
  )
}

export default LiveStreamSetup
