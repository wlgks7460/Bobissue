import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { OpenVidu } from 'openvidu-browser' // ✅ OpenVidu 라이브러리 추가
import SockJS from 'sockjs-client' // ✅ SockJS 사용
import { Client } from '@stomp/stompjs' // ✅ STOMP 사용
import LiveChat from './LiveChat.jsx' // ✅ 채팅 컴포넌트

const LiveStreamSetup = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true'
  const location = useLocation()
  const event = location.state?.event
  const videoRef = useRef(null)
  const stompClientRef = useRef(null) // 📌 STOMP 클라이언트 참조 추가
  const [stream, setStream] = useState(null)
  const [session, setSession] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [chatActive, setChatActive] = useState(false) // 📌 채팅 활성화 여부 추가

  // 📌 현재 시간 계산
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

  // 📌 방송 시작 / 중지 핸들러
  const handleStreamToggle = async () => {
    if (isStreaming) {
      // 방송 중지 로직
      setIsStreaming(false)
      setChatActive(false)
      if (session) {
        session.disconnect()
        setSession(null)
      }
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        stompClientRef.current = null
      }
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
      try {
        // // ✅ OpenVidu 세션 생성 요청
        // const sessionRes = await fetch("https://43.202.60.173/openvidu/api/sessions", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: "Basic " + btoa("OPENVIDUAPP:C108bob"),
        //   },
        //   body: JSON.stringify({}),
        // });
        // const sessionData = await sessionRes.json();
        // console.log("✅ OpenVidu 세션 생성 성공:", sessionData);

        // ✅ 백엔드에서 세션 생성

        // const sessionRes = await fetch('/openvidu/sessions', {
        //   method: 'POST',
        // })
        // const sessionData = await sessionRes.json()
        // const sessionId = sessionData.id
        // console.log('✅ 세션 생성 성공:', sessionId)

        // const token = localStorage.getItem("access_token");
        // console.log(token);
        const sessionRes = await fetch('https://www.bobissue.store/api/openvidu/sessions', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(sessionRes);
        const sessionData = await sessionRes.json();
        const sessionId = sessionData.id;
        console.log("✅ 세션 생성 성공:", sessionId);

        // ✅ Connection 생성 요청 (토큰 발급)
        const tokenRes = await fetch(
          `https://43.202.60.173/openvidu/api/sessions/${sessionData.id}/connection`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'),
            },
            body: JSON.stringify({}),
          },
        )
        const tokenData = await tokenRes.json()
        console.log('✅ Connection 토큰 발급 성공:', tokenData.token)

        // ✅ OpenVidu 클라이언트(WebRTC) 연결
        const OV = new OpenVidu()
        const newSession = OV.initSession()

        newSession.on('streamCreated', (event) => {
          const subscriber = newSession.subscribe(event.stream, videoRef.current)
          console.log('📺 새로운 스트림 구독:', subscriber)
        })

        await newSession.connect(tokenData.token)
        console.log('🎥 OpenVidu 연결 성공')
        setSession(newSession)

        setIsStreaming(true)
        setChatActive(true)
        console.log('🎥 videoRef:', videoRef.current)
      } catch (error) {
        console.error('❌ OpenVidu 연결 실패:', error)
      }
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
