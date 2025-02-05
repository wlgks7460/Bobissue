window.global = window // global 변수가 없을 때 자동으로 추가

import React, { useState, useEffect, useRef } from 'react'
import SockJS from 'sockjs-client' // ✅ 기본 import 사용
import { Client } from '@stomp/stompjs' // ✅ stompjs 대신 @stomp/stompjs 사용

const ChatRoom = ({ chattingRoomId }) => {
  const [messages, setMessages] = useState([]) // 메시지 상태
  const [message, setMessage] = useState('') // 입력된 메시지 상태
  const stompClientRef = useRef(null) // WebSocket 클라이언트 상태 관리

  useEffect(() => {
    // 1. SockJS WebSocket 생성
    const socket = new SockJS('http://localhost:8080/ws-stomp') // ✅ WebSocket 엔드포인트
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 자동 재연결 (5초)
      onConnect: () => {
        console.log('✅ 웹소켓 연결 완료')

        // ✅ 1. "/sub/message" 구독 (백엔드에서 메시지를 보내는 경로)
        client.subscribe('/sub/message', (message) => {
          const receivedMessage = JSON.parse(message.body)
          console.log('📩 받은 메시지:', receivedMessage)
          setMessages((prev) => [...prev, receivedMessage]) // 메시지 상태 업데이트
        })

        stompClientRef.current = client // 클라이언트 저장
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame)
      },
    })

    client.activate() // ✅ 클라이언트 활성화

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate() // ✅ 클라이언트 안전하게 종료
        console.log('❌ 웹소켓 연결 종료')
      }
    }
  }, [])

  // ✅ 2. 메시지 전송 함수
  const sendMessage = () => {
    if (stompClientRef.current && message.trim() !== '') {
      const chatMessage = { content: message }

      stompClientRef.current.publish({
        destination: '/pub/messages', // ✅ 백엔드의 "/messages"와 매칭
        body: JSON.stringify(chatMessage),
      })

      console.log('📤 메시지 전송:', chatMessage)
      setMessage('') // 입력창 초기화
    } else {
      console.warn('⚠️ 웹소켓이 아직 연결되지 않았거나, 메시지가 비어 있습니다.')
    }
  }

  return (
    <div className='w-full max-w-lg h-96 bg-white shadow-lg rounded-lg p-4 overflow-y-auto'>
      <h2 className='text-lg font-bold mb-2'>STOMP 기반 채팅</h2>

      <div className='h-64 overflow-y-auto border p-2 rounded-lg'>
        {messages.length === 0 ? (
          <p className='text-gray-500 text-center'>메시지가 없습니다.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className='p-2 border-b'>
              {msg.content}
            </div>
          ))
        )}
      </div>

      <div className='mt-4 flex'>
        <input
          type='text'
          className='flex-1 p-2 border rounded-lg'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='메시지를 입력하세요'
        />
        <button onClick={sendMessage} className='ml-2 p-2 bg-blue-500 text-white rounded-lg'>
          보내기
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
