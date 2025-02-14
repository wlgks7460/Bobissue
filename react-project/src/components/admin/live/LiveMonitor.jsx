// ✅ 필요 시 자동으로 window.global 정의
window.global = window

import React, { useState, useEffect, useRef } from 'react'
import SockJS from 'sockjs-client' // ✅ SockJS 사용
import { Client } from '@stomp/stompjs' // ✅ STOMP 클라이언트

const ChatRoom = ({ chattingRoomId }) => {
  const [messages, setMessages] = useState([]) // 메시지 상태 관리
  const [message, setMessage] = useState('') // 입력된 메시지
  const stompClientRef = useRef(null) // WebSocket 클라이언트 저장
  const videoRef = useRef(null) // 📌 WebRTC 비디오 참조

  useEffect(() => {
    // 📌 WebRTC 스트림 설정
    const setupStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error('미디어 장치를 가져오는 데 실패했습니다.', error)
      }
    }

    setupStream()

    // 📌 WebSocket 설정
    const socket = new SockJS('http://localhost:8080/ws/chat') // ✅ WebSocket 엔드포인트
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
        console.log('❌ 웹소켓 연결 종료')
      }
    }
  }, [])

  // ✅ 메시지 전송 함수 (WebSocket 연결 여부 체크)
  const sendMessage = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn('⚠️ 웹소켓이 아직 연결되지 않았습니다.')
      return
    }

    if (message.trim() !== '') {
      const chatMessage = { content: message }

      stompClientRef.current.publish({
        destination: '/pub/messages', // ✅ 백엔드에서 설정한 엔드포인트 확인
        body: JSON.stringify(chatMessage),
      })

      console.log('📤 메시지 전송:', chatMessage)
      setMessage('') // 입력창 초기화
    }
  }

  // 🌟 더미 데이터 추가 (유튜브 스타일)
  useEffect(() => {
    const dummyMessages = [
      { username: '정해주 🐶🐱', content: '티언 화이탱 ~~' },
      { username: '황소주', content: '대상혁' },
      { username: '띠로리', content: '우와ㅏㅏ' },
      { username: 'Wendy', content: '레전듀' },
      { username: '들꽃', content: '멋져혁' },
      { username: '제로페이스', content: '오늘도 젠지보다 잘하네' },
      { username: '이세형', content: '이게 맞지' },
      { username: '호돌이', content: 'ㅋㅋㅋㅋㅋㅋ' },
      { username: 'ethan', content: '비사아앙 🚨' },
      { username: '해밀', content: '이제 들어왔는데 또 이기고 있네' },
      { username: 'Rosa P 🐼', content: '헐' },
      { username: '바름moon', content: '대박' },
    ]
    setMessages(dummyMessages)
  }, [])

  return (
    <div className='p-6'>
      <div className='w-full h-[600px] flex'>
        {/* 영상이 들어갈 부분 */}
        <div className='flex-1 bg-gray-300 mr-4 rounded-lg flex items-center justify-center text-center'>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className='w-full h-full bg-black rounded-lg'
          ></video>
        </div>
        <div className='w-full max-w-lg h-[600px] bg-white shadow-lg rounded-lg p-4 flex flex-col ml-auto'>
          {/* 강제 종료 버튼 */}
          <button className='mb-4 p-2 bg-red-600 text-white font-bold rounded hover:bg-red-700'>
            🚨 라이브 강제 종료
          </button>

          <div className='flex-1 overflow-y-auto border p-2 rounded-lg bg-gray-100 space-y-2'>
            {messages.length === 0 ? (
              <p className='text-gray-500 text-center'>메시지가 없습니다.</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className='p-2 rounded-lg bg-white shadow-sm flex items-start space-x-2'
                >
                  <div className='w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full'>
                    {msg.username.charAt(0)}
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-blue-500 font-bold'>{msg.username}</span>
                    <span className='text-gray-800'>{msg.content}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className='mt-4 flex'>
            <input
              type='text'
              className='flex-1 p-2 border rounded-l-lg'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='채팅을 입력하세요...'
            />
            <button
              onClick={sendMessage}
              className='p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700'
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom
