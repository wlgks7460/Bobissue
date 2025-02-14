import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import SockJS from 'sockjs-client' // ✅ SockJS 사용
import { Client } from '@stomp/stompjs' // ✅ STOMP 사용
import LiveChat from './LiveChat.jsx'

const LiveStreamSetup = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true'
  const location = useLocation()
  const event = location.state?.event
  const videoRef = useRef(null)
  const remoteVideoRef = useRef(null) // 📌 상대방 비디오 요소 참조
  const stompClientRef = useRef(null) // 📌 STOMP 클라이언트 참조
  const peerConnectionRef = useRef(null) // 📌 WebRTC PeerConnection 객체 참조
  const [stream, setStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [chatActive, setChatActive] = useState(false) // 📌 채팅 활성화 여부 추가
  const [remoteStream, setRemoteStream] = useState(null) // 📌 원격 스트림 상태 추가

  // 📌 현재 시간
  const now = moment()
  const startAt = event?.startAt ? moment(event.startAt, 'YYYYMMDD HHmmss') : null
  const endAt = event?.endAt ? moment(event.endAt, 'YYYYMMDD HHmmss') : null
  const isLiveAvailable = startAt && endAt && now.isBetween(startAt, endAt)

  // 📌 마이크 및 비디오 ON/OFF 시 스트림 재설정
  useEffect(() => {
    const setupStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: cameraOn,
          audio: micOn,
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error('❌ 미디어 장치를 가져오는 데 실패했습니다.', error)
      }
    }
    setupStream()
  }, [cameraOn, micOn]) // 마이크 또는 카메라 상태 변경 시 다시 스트림 설정

  // 📌 방송 시작 / 중지 핸들러 (SockJS + STOMP 사용)
  const handleStreamToggle = () => {
    console.log(`라이브 가능 여부: ${isLiveAvailable}, 디버그 모드: ${debug_mode}`)

    if (!isLiveAvailable && !debug_mode) {
      return
    }

    if (isStreaming) {
      setIsStreaming(false)
      setChatActive(false) // 📌 방송이 종료되면 채팅도 종료

      // 📌 STOMP 연결 해제
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        stompClientRef.current = null
        console.log('🎥 스트리밍 서버 연결 종료')
      }

      // 📌 스트림 종료
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      // 📌 PeerConnection 해제
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: cameraOn, audio: micOn })
        .then((mediaStream) => {
          setStream(mediaStream)
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
          }

          // 🎥 WebRTC 연결 설정
          startStreaming(mediaStream)
        })
        .catch((error) => console.error('❌ 미디어 장치를 가져오는 데 실패했습니다.', error))

      setIsStreaming(true)
      setChatActive(true) // 📌 방송 시작 시 채팅도 시작
    }
  }

  // 📌 WebRTC 연결 설정 함수
  const startStreaming = async (mediaStream) => {
    // 📌 PeerConnection 생성
    peerConnectionRef.current = createPeerConnection()

    // 📌 미디어 스트림을 PeerConnection에 추가
    mediaStream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, mediaStream)
    })

    // 📌 SDP Offer 생성 및 전송
    const offer = await peerConnectionRef.current.createOffer()
    await peerConnectionRef.current.setLocalDescription(offer)
    sendSignalMessage('offer', { sdp: offer })
  }

  // 📌 PeerConnection 객체 생성 함수
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // STUN 서버 (NAT 우회)
      ],
    })

    // 📌 ICE 후보 생성 시 서버로 전송
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalMessage('ice-candidate', { candidate: event.candidate })
      }
    }

    // 📌 원격 미디어 스트림 추가 시 화면에 표시
    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0])
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    return peer
  }

  // 📌 시그널링 메시지 전송 함수
  const sendSignalMessage = (type, data) => {
    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: '/pub/live/webrtc',
        body: JSON.stringify({
          type,
          ...data,
          streamKey: event?.id || 'defaultStreamKey',
          sender: localStorage.getItem('user_id') || 'guest',
        }),
      })
    }
  }

  // 📌 시그널링 서버 설정 및 STOMP 연결
  const setupStompClient = () => {
    const socket = new SockJS('http://localhost:8080/ws/live')
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ STOMP WebSocket 연결 완료')
        client.subscribe('/sub/live/webrtc', (message) => {
          const data = JSON.parse(message.body)

          if (data.type === 'offer') {
            handleOffer(data)
          } else if (data.type === 'answer') {
            handleAnswer(data)
          } else if (data.type === 'ice-candidate') {
            handleIceCandidate(data)
          }
        })
      },
    })

    stompClientRef.current = client
    client.activate()
  }

  // 📌 Offer 수신 시 처리
  const handleOffer = async (data) => {
    peerConnectionRef.current = createPeerConnection()
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp))

    // 📌 SDP Answer 생성 및 서버로 전송
    const answer = await peerConnectionRef.current.createAnswer()
    await peerConnectionRef.current.setLocalDescription(answer)
    sendSignalMessage('answer', { sdp: answer })
  }

  // 📌 Answer 수신 시 처리
  const handleAnswer = async (data) => {
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
  }

  // 📌 ICE 후보 수신 시 처리
  const handleIceCandidate = async (data) => {
    if (data.candidate) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  }

  // 📌 마이크 토글 핸들러
  const handleMicToggle = () => {
    setMicOn((prevMicOn) => !prevMicOn)
  }

  // 📌 카메라 토글 핸들러
  const handleCameraToggle = () => {
    setCameraOn((prevCameraOn) => !prevCameraOn)
  }

  // 📌 컴포넌트 렌더링 시 시그널링 서버 연결
  useEffect(() => {
    setupStompClient()

    return () => {
      // 📌 컴포넌트 언마운트 시 연결 해제
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
      }
    }
  }, [])

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

      {/* 📌 상대방 방송 화면 */}
      <div className='relative border rounded-lg shadow-md bg-black w-full mx-auto mt-4'>
        {remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className='w-full h-[500px] bg-black'
          ></video>
        )}
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

      {/* 📌 채팅 UI (방송이 켜진 경우에만) */}
      {chatActive && <LiveChat channelId={event?.id || 'defaultStreamKey'} />}
    </div>
  )
}

export default LiveStreamSetup
