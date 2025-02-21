import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:5000')

const LiveViewer = () => {
  const videoRef = useRef(null)

  useEffect(() => {
    socket.emit('join-broadcast', { viewerId: 'viewer123' })

    socket.on('stream', (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    })

    return () => {
      socket.emit('leave-broadcast')
    }
  }, [])

  return (
    <div>
      <h1>라이브 방송 시청</h1>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  )
}

export default LiveViewer
