import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import API from '@/utils/API' // API 호출용
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
        // const sessionRes = await fetch('https://www.bobissue.store/api/openvidu/sessions', {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        // const sessionRes = await API.post('https://bobissue.store/api/openvidu/sessions');
  
        // console.log(sessionRes);
        // if (sessionRes.status === 200) {
        //   const sessionData = sessionRes.data;
        //   console.log("✅ 세션 생성 성공:", sessionData);
            
        //   const sessionId = sessionData.id;
        //   console.log("✅ 세션 ID:", sessionId);
          
        //   // ✅ Connection 생성 요청 (토큰 발급)
        //   // const tokenRes = await fetch(
        //   //   `https://bobissue.store/api/openvidu/sessions/mySession3/token`,
        //   //   {
        //   //     method: 'POST',
        //   //     headers: {
        //   //       'Content-Type': 'application/json',
        //   //       Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
        //   //     },
        //   //     body: JSON.stringify({}),
        //   //   }
        //   // );

        //   const tokenRes = await API.post('https://bobissue.store/api/openvidu/sessions/mySession4/token');
        //   console.log("✅ 서버11에서 받은 토큰:", tokenRes);
        //   // const tokenData = await tokenRes.json();
        //   const token = tokenRes.token;  // 발급된 토큰을 사용
        //   // 토큰 값 로그 출력
        //   console.log("✅ 서버에서 받은 토큰:", token);
        //   // // OpenVidu 클라이언트 연결
        //   // const OV = new OpenVidu();
        //   // const newSession = OV.initSession();

        //   // newSession.on('streamCreated', (event) => {
        //   //   const subscriber = newSession.subscribe(event.stream, videoRef.current);
        //   //   console.log('📺 새로운 스트림 구독:', subscriber);
        //   // });

        //   // await newSession.connect(token)

        //   // OpenVidu 클라이언트 연결
        //   const OV = new OpenVidu();
        //   const newSession = OV.initSession();

        //   // 송출용 publisher 설정
        //   const publisher = OV.initPublisher(videoRef.current, {
        //     audioSource: undefined, // 오디오 소스 없이 설정
        //     videoSource: undefined, // 비디오 소스 없이 설정
        //     publishAudio: true, // 오디오 송출
        //     publishVideo: true, // 비디오 송출
        //     resolution: '640x480', // 해상도 설정
        //     frameRate: 30, // 프레임 속도 설정
        //   });

        //   // 스트림을 송출하는 코드
        //   newSession.on('streamCreated', (event) => {
        //     // 송출을 위한 스트림 처리 (구독은 필요 없으므로 제거)
        //     console.log('📺 송출 스트림:', event.stream);
        //   });

        //   // 세션 연결
        //   await newSession.connect(token, { clientData: 'Publisher' });

        //   // 송출 시작
        //   newSession.publish(publisher);

        //   // const sessionRes = await API.post('http://localhost:8080/api/openvidu/sessions');


        //   // // ✅ Connection 생성 요청 (토큰 발급)
        //   // const tokenRes = await fetch(
        //   //   `https://bobissue.store/openvidu/api/sessions/${sessionData.id}/connection`,
        //   //   {
        //   //     method: 'POST',
        //   //     headers: {
        //   //       'Content-Type': 'application/json',
        //   //       Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'),
        //   //     },
        //   //     body: JSON.stringify({}),
        //   //   },
        //   // )
        //   // const tokenData = await tokenRes.json()
        //   // console.log('✅ Connection 토큰 발급 성공:', tokenData.token)

        //   // ✅ OpenVidu 클라이언트(WebRTC) 연결
        //   // const OV = new OpenVidu()
        //   // const newSession = OV.initSession()

        //   // newSession.on('streamCreated', (event) => {
        //   //   const subscriber = newSession.subscribe(event.stream, videoRef.current)
        //   //   console.log('📺 새로운 스트림 구독:', subscriber)
        //   // })

        //   // await newSession.connect(tokenData.token)
        //   // console.log('🎥 OpenVidu 연결 성공')
        //   setSession(newSession)

        //   setIsStreaming(true)
        //   setChatActive(true)
        //   console.log('🎥 videoRef:', videoRef.current)


              // 세션 생성 요청
      const sessionRes = await API.post('https://bobissue.store/api/openvidu/sessions');
      console.log(sessionRes);
      if (sessionRes.status === 200) {
        const sessionData = sessionRes.data;
        console.log("✅ 세션 생성 성공:", sessionData);
        
        // const sessionId = sessionData.id;
        // console.log("✅ 세션 ID:", sessionId);

        // // 토큰 발급 요청
        // const tokenRes = await fetch('https://bobissue.store/api/openvidu/sessions/mySession7/token', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
        //   },
        //   body: JSON.stringify({}),
        // });
        // POST /openvidu/api/sessions/{sessionId}/connection API를 사용하여 토큰 발급
        const tokenRes = await API.post('https://bobissue.store/api/openvidu/sessions/mySession7/connections');

                
        // 토큰 발급 요청
        // const tokenRes = await API.post(`https://bobissue.store/api/openvidu/sessions/${sessionId}/token`);
        // console.log("✅ 서버에서 받은 토큰:", tokenRes);
                // 서버 응답을 JSON 형식으로 처리
const responseJson = await tokenRes.json();
console.log('🔍 서버 응답:', responseJson);  // 응답 확인

        // 응답에서 token을 추출하고, 실제 token 값만 사용
const tokenUrl = responseJson.token;  // token 필드에 WebSocket URL이 들어있음
const token = new URL(tokenUrl).searchParams.get('token');  // URL에서 token 파라미터 추출

        // // 토큰 값 저장
        // const token = tokenRes.data.token; // token 값을 이 위치에서 받도록 해야 합니다.

        
        // 토큰 값 확인
        console.log("🔑 받은 토큰123444:", tokenRes);
        console.log("🔑 받은 토큰:", token);
        // OpenVidu 클라이언트 연결

                // WebSocket URL 설정
        const sessionId = 'mySession7';  // 사용하려는 세션 ID
        console.log("이것좀 보소"+sessionId)
const wsUrl = `wss://bobissue.store:8443/openvidu?sessionId=${sessionId}&token=${token}`;
console.log("🔍 WebSocket URL:", wsUrl);
        const OV = new OpenVidu();
        const newSession = OV.initSession();

        // 송출용 publisher 설정
        const publisher = OV.initPublisher(videoRef.current, {
          audioSource: undefined, // 오디오 소스 없이 설정
          videoSource: undefined, // 비디오 소스 없이 설정
          publishAudio: true, // 오디오 송출
          publishVideo: true, // 비디오 송출
          resolution: '640x480', // 해상도 설정
          frameRate: 30, // 프레임 속도 설정
        });

        // 스트림을 송출하는 코드
        newSession.on('streamCreated', (event) => {
          // 송출을 위한 스트림 처리 (구독은 필요 없으므로 제거)
          console.log('📺 송출 스트림:', event.stream);
        });

        // 세션 연결
        await newSession.connect(wsUrl, { clientData: 'Publisher' });

        // 송출 시작
        newSession.publish(publisher);

        setSession(newSession)
        setIsStreaming(true)
        setChatActive(true)
        console.log('🎥 videoRef:', videoRef.current)
        } else {
          console.error('❌ 세션 생성 실패:', sessionRes.status)
        }
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
