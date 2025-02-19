import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
//import API from '@/utils/API' // API 호출용
import { OpenVidu } from 'openvidu-browser' // ✅ OpenVidu 라이브러리 추가
//import SockJS from 'sockjs-client' // ✅ SockJS 사용
//import { Client } from '@stomp/stompjs' // ✅ STOMP 사용
import LiveChat from './LiveChat.jsx' // ✅ 채팅 컴포넌트
import axios from 'axios' // axios 임포트 추가
import { FaVideo, FaMicrophone, FaMicrophoneSlash, FaCamera, FaVideoSlash } from 'react-icons/fa';

const LiveStreamSetup = () => {
  
  const debug_mode = true;
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

  // 방송 시작 (joinSession)
  const joinSession = async () => {
    

    const OV = new OpenVidu();

    const mySession = OV.initSession();
    
    setSession(mySession);

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
    });

    mySession.on('streamDestroyed', (event) => {
      // Handle stream destroyed
    });

    mySession.on('exception', (exception) => {
      console.warn(exception);
    });
    

    // 배포된 OpenVidu 서버에서 토큰 가져오기
    try {
      const token = await getToken(); // getToken()을 사용하여 토큰을 받아옴
      console.log('📌 백엔드에서 받은 OpenVidu 토큰:', token);

      await mySession.connect(token);

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });

      mySession.publish(publisher);
      setSession(mySession);
      setIsStreaming(true);
      setChatActive(true);
    } catch (error) {
      console.error('❌ OpenVidu 연결 실패:', error);
    }
  };

  // 방송 끄기 (leaveSession)
  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }
    setSession(null);
    setIsStreaming(false);
    setChatActive(false);
    setStream(null);
  };

  // 📌 방송 시작 / 중지 핸들러
  const handleStreamToggle = async () => {
    if (isStreaming) {
      leaveSession(); // 방송 종료
    } else {
      joinSession(); // 방송 시작
    }
  };


    // 📌 토큰 가져오기
    const getToken = async () => {
      const sessionId = await createSession("jihancast");
      const fullToken = await createToken(sessionId);
    
      console.log("📌 OpenVidu에서 받은 전체 토큰:", fullToken);
    
      if (!fullToken.startsWith("wss://")) {
        console.error("❌ 잘못된 OpenVidu 토큰 형식:", fullToken);
        throw new Error("올바른 WebSocket 토큰이 아님");
      }
    
      return fullToken; // ✅ OpenVidu가 준 URL 그대로 반환
    }
  
    // 📌 세션 생성
    const createSession = async (sessionId) => {
      try {
        const response = await axios.post(
          'https://bobissue.store/api/openvidu/sessions',
          { customSessionId: "jihancastt" },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log("📌 OpenVidu 세션 생성 응답:", response);
        console.log("📌 OpenVidu 세션 생성 응답:", response.data);
        return response;
      } catch (error) {
        console.error('❌ 세션 생성 실패:', error.response?.data || error);
        throw error;
      }
    }
  
  // 📌 백엔드에서 OpenVidu 토큰 생성 요청
  const createToken = async (sessionId) => {
    try {
      const response = await axios.post(
        `https://bobissue.store/api/openvidu/sessions/jihancastt/connections`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("📌 OpenVidu 토큰 생성 응답:", response);
      console.log("📌 OpenVidu 토큰 생성 응답:", response.data.token);
      return response.data;
    } catch (error) {
      console.error('❌ 토큰 생성 실패:', error.response?.data || error);
      throw error;
    }
  };

  // 📌 마이크 토글 핸들러
  const handleMicToggle = () => {
    setMicOn((prevMicOn) => !prevMicOn)
  }

  // 📌 카메라 토글 핸들러
  const handleCameraToggle = () => {
    setCameraOn((prevCameraOn) => !prevCameraOn)
  }

  return (
    <div className='w-full mx-auto px-8 py-10 min-h-screen bg-warmBeige/20'>
    {/* 헤더 */}
    <header className='text-center mb-8'>
      <h1 className='text-4xl font-extrabold text-espressoBlack'>라이브 방송 환경 설정</h1>
      <p className='text-lg text-coffeeBrown mt-3'>방송을 설정하고 시청자와 소통하세요.</p>
    </header>

    {/* 방송 가능 여부 알림 */}
    {!isLiveAvailable && !debug_mode && (
      <div className='text-red-500 text-lg font-semibold text-center mb-6'>
        🚫 라이브 방송은 {startAt?.format('YYYY-MM-DD HH:mm')} ~ {endAt?.format('HH:mm')} 동안에만 가능합니다.
      </div>
    )}

    {/* 방송 화면 미리보기 */}
    <div className='relative border rounded-lg shadow-md bg-black w-full mx-auto overflow-hidden'>
      <video ref={videoRef} autoPlay playsInline className='w-full h-[500px] bg-black'></video>
    </div>

    {/* 컨트롤 버튼 그룹 */}
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>
      <ControlButton
        onClick={handleStreamToggle}
        isActive={isStreaming}
        activeText='방송 중지'
        inactiveText='방송 시작'
        activeColor='bg-red-500 hover:bg-red-600'
        inactiveColor='bg-mochaBrown hover:bg-green-600'
        icon={isStreaming ? <FaVideoSlash /> : <FaVideo />}
        disabled={!debug_mode && !isLiveAvailable}
      />
      
      <ControlButton
        onClick={handleMicToggle}
        isActive={micOn}
        activeText='마이크 끄기'
        inactiveText='마이크 켜기'
        activeColor='bg-blue-500 hover:bg-blue-600'
        inactiveColor='bg-coffeeBrown-500 hover:bg-gray-600'
        icon={micOn ? <FaMicrophoneSlash /> : <FaMicrophone />}
      />
      
      <ControlButton
        onClick={handleCameraToggle}
        isActive={cameraOn}
        activeText='카메라 끄기'
        inactiveText='카메라 켜기'
        activeColor='bg-yellow-500 hover:bg-yellow-600'
        inactiveColor='bg-gray-500 hover:bg-gray-600'
        icon={cameraOn ? <FaVideoSlash /> : <FaCamera />}
      />
    </div>

    {/* 채팅 UI */}
    {chatActive && (
      <div className='mt-8'>
        <LiveChat channelId={event?.id || 'defaultStreamKey'} />
      </div>
    )}
   
  </div>
);
};

// 컨트롤 버튼 컴포넌트
const ControlButton = ({ onClick, isActive, activeText, inactiveText, activeColor, inactiveColor, icon, disabled }) => (
<button
  onClick={onClick}
  className={`flex items-center justify-center w-full px-6 py-3 font-bold text-white rounded-lg shadow-md transition-all ${
    isActive ? activeColor : inactiveColor
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={disabled}
>
  <span className='mr-2 text-lg'>{icon}</span>
  {isActive ? activeText : inactiveText}
</button>

)


export default LiveStreamSetup
