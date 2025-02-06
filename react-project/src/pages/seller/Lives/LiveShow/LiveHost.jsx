import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:5000') // Signaling 서버 주소

const LiveHost = () => {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }

        // 방송 시작: 클라이언트의 스트림을 서버로 전송
        socket.emit('start-broadcast', { hostId: 'host123' })
        mediaStream.getTracks().forEach((track) => {
          socket.emit('stream', track)
        })
      } catch (error) {
        console.error('웹캠 접근 실패:', error)
      }
    }

    startStreaming()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()) // 방송 종료 시 스트림 중지
      }
      socket.emit('end-broadcast')
    }
  }, [])

  return (
    <div>
      <h1>라이브 방송 시작</h1>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  )
}

export default LiveHost
