import React from 'react'
import ChatRoom from '../../../components/admin/chat/Chat'

const ChatRoomPage = () => {
  const chattingRoomId = 123 // 테스트용 채팅방 ID (추후 동적으로 변경 가능)

  return (
    <div className='p-4 w-full h-screen flex flex-col items-center bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>라이브 채팅</h1>
      <ChatRoom chattingRoomId={chattingRoomId} />
    </div>
  )
}

export default ChatRoomPage
