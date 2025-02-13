import React, { useState, useEffect, useRef } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const LiveChat = ({ channelId }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const stompClientRef = useRef(null)

  useEffect(() => {
    if (!channelId) {
      console.error('🚫 채널 ID가 없습니다. 채팅 서버에 연결할 수 없습니다.')
      return
    }

    const socket = new SockJS('http://localhost:8080/ws/chat')
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
  }, [channelId])

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

  // ✅ Enter 키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className='w-full max-w-lg h-96 bg-white shadow-lg rounded-lg p-4 overflow-y-auto'>
      <h2 className='text-lg font-bold mb-2 text-center'>라이브 채팅방</h2>

      {/* 📌 채팅 메시지 표시 */}
      <div className='h-64 overflow-y-auto border p-2 rounded-lg bg-gray-100'>
        {messages.length === 0 ? (
          <p className='text-gray-500 text-center'>메시지가 없습니다.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className='p-2 border-b'>
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>

      {/* 📌 메시지 입력 및 전송 버튼 */}
      <div className='mt-4 flex'>
        <input
          type='text'
          className='flex-1 p-2 border rounded-lg'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Enter 키로 전송
          placeholder='메시지를 입력하세요...'
        />
        <button onClick={sendMessage} className='ml-2 p-2 bg-blue-500 text-white rounded-lg'>
          보내기
        </button>
      </div>
    </div>
  )
}

export default LiveChat
