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
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`✅ 채팅 서버 연결 완료 (채널: ${channelId})`)
        stompClientRef.current = client
        client.subscribe(`/sub/chat/${channelId}`, (message) => {
          const receivedMessage = JSON.parse(message.body)
          console.log('📩 받은 메시지:', receivedMessage)
          setMessages((prev) => [...prev, receivedMessage])
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

  const sendMessage = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn('⚠️ 웹소켓이 아직 연결되지 않았습니다.')
      return
    }

    if (message.trim() !== '') {
      const chatMessage = { channelId, content: message }
      stompClientRef.current.publish({
        destination: '/pub/chat',
        body: JSON.stringify(chatMessage),
      })
      console.log('📤 메시지 전송:', chatMessage)
      setMessages((prev) => [...prev, chatMessage])
      setMessage('')
    }
  }

  return (
    <div className='w-full max-w-lg h-96 bg-white shadow-lg rounded-lg p-4 overflow-y-auto'>
      <h2 className='text-lg font-bold mb-2 text-center'>라이브 채팅방</h2>
      <div className='h-64 overflow-y-auto border p-2 rounded-lg'>
        {messages.map((msg, index) => (
          <div key={index} className='p-2 border-b'>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveChat
