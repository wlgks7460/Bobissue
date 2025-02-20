import React, { useEffect, useRef, useState } from 'react'
import { OpenVidu } from 'openvidu-browser'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import axios from 'axios'
import SearchBar from '../../components/consumer/common/SearchBar'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined'
import LiveItemList from '../../components/consumer/live/LiveItemList'

const BASE_URL = import.meta.env.VITE_BOBISUUE_BASE_URL

const Live = () => {
  // 화면 핸들 관련
  const [isHover, setIsHover] = useState(false)
  const [isPause, setIsPause] = useState(false)

  const fullScreenRef = useRef()
  const [isFullScreen, setIsFullScreen] = useState(false)

  const enterFullscreen = () => {
    if (!isFullScreen) {
      // 전체 화면
      if (fullScreenRef.current?.requestFullscreen) {
        fullScreenRef.current.requestFullscreen()
      } else if (fullScreenRef.current?.webkitRequestFullscreen) {
        fullScreenRef.current.webkitRequestFullscreen() // Safari
      } else if (fullScreenRef.current?.mozRequestFullScreen) {
        fullScreenRef.current.mozRequestFullScreen() // Firefox
      } else if (fullScreenRef.current?.msRequestFullscreen) {
        fullScreenRef.current.msRequestFullscreen() // IE/Edge
      }
    } else {
      // 전체화면 해제
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen() // Safari
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen() // Firefox
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen() // IE/Edge
      }
    }
  }

  // 라이브 커머스(영상, 채팅) 관련
  const [session, setSession] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [messages, setMessages] = useState([])
  const [sessionId] = useState('cast') // 기본 세션 ID 설정

  // 전체 화면 감지
  useEffect(() => {
    // mount
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange) // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange) // IE/Edge
    // unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const sessionRef = useRef(null)
  const stompClientRef = useRef(null)
  const videoContainerRef = useRef(null) // 비디오 화면 표시용
  const chatInputRef = useRef()

  const initializeSession = async () => {
    const OV = new OpenVidu()
    const newSession = OV.initSession()

    // 📌 구독자(Subscriber)만 동작 (스트림 받아서 표시)
    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined)
      setSubscribers((prev) => [...prev, subscriber])

      console.log('📌 Subscribing to', event.stream.connection.connectionId)
      // console.log("📌 Stream Tracks:", event.stream.getMediaStream().getVideoTracks());
      subscriber.subscribeToAudio(true)
      if (event.stream.hasVideo) {
        console.log('✅ 스트림에 비디오 포함됨!')
      } else {
        console.log('❌ 스트림에 비디오 없음!')
      }
    })

    newSession.on('streamDestroyed', (event) => {
      setSubscribers((prev) => prev.filter((sub) => sub !== event.stream))
    })

    const token = await getToken(sessionId)
    await newSession.connect(token, { clientData: 'Viewer' })

    setSession(newSession)
    sessionRef.current = newSession
  }

  useEffect(() => {
    initializeSession()
    setupWebSocket()

    return () => {
      sessionRef.current?.disconnect()
      stompClientRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (subscribers.length > 0 && videoContainerRef.current) {
      setTimeout(() => {
        console.log('🎥 비디오 스트림을 화면에 추가합니다.')

        const videoElement = document.createElement('video')
        videoElement.autoplay = true
        videoElement.playsInline = true
        videoElement.muted = false
        videoElement.style.width = '100%'

        videoContainerRef.current.innerHTML = ''
        videoContainerRef.current.appendChild(videoElement)

        // 📌 스트림을 비디오 요소에 바인딩
        subscribers[subscribers.length - 1].addVideoElement(videoElement)
        console.log('✅ 비디오 요소가 성공적으로 바인딩되었습니다.')
        console.log('📌 비디오 소스 정보:', videoElement.srcObject)
      }, 500) // 0.5초 딜레이
    }
  }, [subscribers])

  const setupWebSocket = () => {
    console.log('webSocket 접속 시도')
    const socket = new SockJS(`${BASE_URL}/ws/chat`)
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 자동 재연결 (5초)
      onConnect: () => {
        console.log('✅ 웹소켓 연결 완료')

        // 🌟 클라이언트 객체를 먼저 저장한 후 구독 설정

        stompClientRef.current = client

        client.subscribe('/sub/message', (message) => {
          const receivedMessage = JSON.parse(message.body)
          console.log('📩 받은 메시지:', receivedMessage)
          setMessages((prev) => [...prev, receivedMessage]) // 상태 업데이트
        })
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류 발생:', frame)
      },
    })
    stompClientRef.current = client
    client.activate()

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        console.log('❌ 채팅 서버 연결 종료')
      }
    }
  }

  const getToken = async (sessionId) => {
    const response = await axios.post(
      `${BASE_URL}/api/openvidu/sessions/jihancastt/connections`,
      {},
    )
    console.log('📌 서버에서 받은 토큰:', response.data)
    return response.data
  }

  // ✅ 메시지 전송 함수 (WebSocket 연결 여부 체크)
  const sendMessage = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn('⚠️ 웹소켓이 아직 연결되지 않았습니다.')
      return
    }
    const message = chatInputRef.current.value
    if (message.trim() !== '') {
      const chatMessage = { content: message }

      stompClientRef.current.publish({
        destination: '/pub/messages', // ✅ 백엔드에서 설정한 엔드포인트 확인
        body: JSON.stringify(chatMessage),
      })

      console.log('📤 메시지 전송:', chatMessage)
      chatInputRef.current.value = '' // 입력창 초기화
    }
  }
  // ✅ Enter 키로 메시지 전송
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }
  // 일시정지 기능
  const togglePauseVideo = () => {
    if (!videoContainerRef.current) return

    const videoElement = videoContainerRef.current.querySelector('video')
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play()
        setIsPause(false)
      } else {
        videoElement.pause()
        setIsPause(true)
      }
    }
  }

  return (
    <div>
      <SearchBar />
      <div className='min-h-[70vh] flex justify-center'>
        <div className='w-[75rem] h-[700px] flex mt-10 border border-[#6F4E37] rounded'>
          <div className='w-3/4 h-full flex flex-col rounded'>
            {/* 라이브 방송 */}
            <div
              className='grow relative'
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
              ref={fullScreenRef}
            >
              <div className='w-full h-full bg-black' ref={videoContainerRef}></div>
              {isHover && (
                <div className='w-full h-full flex items-end bg-black/50 absolute top-0 left-0 rounded-tl'>
                  <div className='w-full flex justify-between'>
                    <div className='m-2 '>
                      <button className='text-white' onClick={togglePauseVideo}>
                        {isPause ? (
                          <PlayArrowIcon sx={{ fontSize: 30 }} />
                        ) : (
                          <PauseIcon sx={{ fontSize: 30 }} />
                        )}
                      </button>
                    </div>
                    <div className='m-2'>
                      <button className='text-white' onClick={enterFullscreen}>
                        {isFullScreen ? (
                          <FullscreenExitOutlinedIcon sx={{ fontSize: 30 }} />
                        ) : (
                          <FullscreenOutlinedIcon sx={{ fontSize: 30 }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* 상품 */}
            <LiveItemList />
          </div>
          {/* 채팅 */}
          <div className='w-1/4 h-full flex flex-col border-s border-[#6F4E37] rounded-e'>
            {/* 채팅 출력 */}
            <div className='grow p-3 bg-[#F8F0E5] rounded-tr'>
              {messages.map((msg, index) => (
                <div key={`msg-${index}`} className='py-2 border-b'>
                  {msg.sender}: {msg.content}
                </div>
              ))}
            </div>
            {/* 채팅 입력 */}
            <div className='w-full flex-none flex items-end bg-[#F8F0E5] border-t border-[#6F4E37] p-3 rounded-br'>
              <textarea
                type='text'
                ref={chatInputRef}
                className='grow h-[32px] min-h-[32px] max-h-[100px] p-1 border border-[#6F4E37] text-sm 
                resize-none overflow-y-auto rounded outline-none focus:ring-0'
                onInput={(e) => {
                  e.target.style.height = '32px' // 높이 초기화
                  e.target.style.height = e.target.scrollHeight + 'px' // 내용에 맞게 높이 조정
                }}
                onKeyUp={handleKeyUp}
              ></textarea>
              <button
                className='flex-none px-2 py-1 ms-1 rounded bg-gray-300 hover:bg-[#6F4E37] hover:text-white text-sm'
                onClick={sendMessage}
              >
                <SendOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Live
