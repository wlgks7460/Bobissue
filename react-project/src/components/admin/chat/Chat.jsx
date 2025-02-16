// ✅ 필요 시 자동으로 window.global 정의
window.global = window

import React, { useState, useEffect, useRef } from 'react'
import SockJS from 'sockjs-client' // ✅ SockJS 사용
import { Client } from '@stomp/stompjs' // ✅ STOMP 클라이언트
import { OpenVidu } from 'openvidu-browser' // ✅ OpenVidu 라이브러리 추가

const ChatRoom = ({ sessionId }) => {
  const [messages, setMessages] = useState([]) // 메시지 상태 관리
  const [message, setMessage] = useState('') // 입력된 메시지
  const stompClientRef = useRef(null) // WebSocket 클라이언트 저장
  const videoRef = useRef(null) // 📌 시청자 비디오 화면 참조
  const sessionRef = useRef(null) // 📌 OpenVidu 세션 객체 참조

  useEffect(() => {
    // 📌 OpenVidu 세션 연결 (시청자)
    // const connectToSession = async () => {
    //   // try {
    //     console.log(`🔍 OpenVidu 연결 시도: 세션 ID = mySession1`)

        
    //       // ✅ Connection 생성 요청 (토큰 발급)
    //       const tokenRes = await fetch(
    //         `https://bobissue.store/api/openvidu/sessions/${sessionId}/token`,
    //         {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
    //           },
    //           body: JSON.stringify({}),
    //         }
    //   );
      
    //   if (!tokenRes.ok) {
    //     throw new Error(`❌ 서버 응답 오류: ${tokenRes.status}`);
    //   }

    //   const { token } = await tokenRes.json();

    //       // OpenVidu 클라이언트 연결
    //       const OV = new OpenVidu();
    //       const newSession = OV.initSession();

    //       newSession.on('streamCreated', (event) => {
    //         const subscriber = newSession.subscribe(event.stream, videoRef.current);
    //         console.log('📺 새로운 스트림 구독:', subscriber);
    //       });

    //       await newSession.connect(token)

    //   //   // ✅ 응답이 정상적인지 확인
    //   //   if (!tokenRes.ok) {
    //   //     throw new Error(`❌ 서버 응답 오류: ${tokenRes.status} ${tokenRes.statusText}`)
    //   //   }

    //   //   // ✅ JSON 파싱
    //   //   const tokenData = await tokenRes.json()
    //   //   console.log('✅ 시청자 토큰 발급 성공:', tokenData.token)

    //   //   // ✅ OpenVidu 초기화
    //   //   const OV = new OpenVidu()
    //   //   const session = OV.initSession()
    //   //   sessionRef.current = session

    //   //   session.on('streamCreated', (event) => {
    //   //     const subscriber = session.subscribe(event.stream, videoRef.current)
    //   //     console.log('📺 새로운 스트림 구독:', subscriber)
    //   //   })

    //   //   await session.connect(tokenData.token)
    //   //   console.log('🎥 시청자 OpenVidu 연결 성공')
    //   // } catch (error) {
    //   //   console.error('❌ 시청자 OpenVidu 연결 실패:', error)
    //   // }

    //   // console.log(`🔍 OpenVidu 연결 시도: 세션 ID = ${sessionId}`)
      
    // }

    // const connectToSession = async () => {
    //   try {
    //     console.log(`🔍 OpenVidu 연결 시도: 세션 ID = ${sessionId}`);
        
    //     // 토큰 발급 요청
    //     const tokenRes = await fetch(`https://bobissue.store/api/openvidu/sessions/mySession3/token`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
    //       },
    //       body: JSON.stringify({}),
    //     });
        
    //     if (!tokenRes.ok) {
    //       throw new Error(`❌ 서버 응답 오류: ${tokenRes.status}`);
    //     }

    //     const { token } = await tokenRes.json();


    //     // 토큰 값 로그 출력
    //     console.log("✅ 서버에서 받은 토큰:", token);
        
    //     // OpenVidu 세션 초기화 및 연결
    //     const OV = new OpenVidu();
    //     const session = OV.initSession();
    //     sessionRef.current = session;

    //     session.on('streamCreated', (event) => {
    //       session.subscribe(event.stream, videoRef.current);
    //       console.log('📺 새로운 스트림 구독');
    //     });

    //     await session.connect(token);
    //     console.log('🎥 OpenVidu 연결 성공');
    //   } catch (error) {
    //     console.error('❌ OpenVidu 연결 실패:', error);
    //   }
    // };

    const connectToSession = async () => {
      // try {
      //   console.log(`🔍 OpenVidu 연결 시도: 세션 ID = ${sessionId}`);
    
      //   // // 토큰 발급 요청
      //   // const tokenRes = await fetch(`https://bobissue.store/api/openvidu/sessions/mySession3/token`, {
      //   //   method: 'POST',
      //   //   headers: {
      //   //     'Content-Type': 'application/json',
      //   //     Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
      //   //   },
      //   //   body: JSON.stringify({}),
      //   // });
    
      //   // if (!tokenRes.ok) {
      //   //   throw new Error(`❌ 서버 응답 오류: ${tokenRes.status}`);
      //   // }
    
      //   // const { token } = await tokenRes.json();

      //   const tokenRes = await API.post('https://bobissue.store/api/openvidu/sessions/mySession4/token');
      //   console.log("✅ 서버11에서 받은 토큰:", tokenRes);
      //   // const tokenData = await tokenRes.json();
      //   const token = tokenRes.token;  // 발급된 토큰을 사용
      //   // 토큰 값 로그 출력
      //   console.log("✅ 서버에서 받은 토큰:", token);
    
      //   // 토큰 값 로그 출력
      //   // console.log("✅ 서버에서 받은 토큰:", token);
    
      //   // OpenVidu 세션 초기화 및 연결
      //   const OV = new OpenVidu();
      //   const session = OV.initSession();
      //   sessionRef.current = session;
    
      //   // 스트림이 생성될 때마다 구독 처리
      //   session.on('streamCreated', (event) => {
      //     const subscriber = session.subscribe(event.stream, videoRef.current); // videoRef에 구독된 스트림 연결
      //     console.log('📺 새로운 스트림 구독:', subscriber);
      //   });
    
      //   // 세션 연결
      //   await session.connect(token);
      //   console.log('🎥 OpenVidu 연결 성공');
      // } catch (error) {
      //   console.error('❌ OpenVidu 연결 실패:', error);
      // }

      try {
        console.log(`🔍 OpenVidu 연결 시도: 세션 ID = ${sessionId}`);
        
        // 토큰 발급 요청
        const tokenRes = await fetch('https://bobissue.store/api/openvidu/sessions/mySession6/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
          },
          body: JSON.stringify({}),
        });
        
        if (!tokenRes.ok) {
          throw new Error(`❌ 서버 응답 오류: ${tokenRes.status}`);
        }

        const { token } = await tokenRes.json();

        // OpenVidu 세션 초기화 및 연결
        const OV = new OpenVidu();
        const session = OV.initSession();
        sessionRef.current = session;

        // 스트림이 생성될 때마다 구독 처리
        session.on('streamCreated', (event) => {
          const subscriber = session.subscribe(event.stream, videoRef.current); // videoRef에 구독된 스트림 연결
          console.log('📺 새로운 스트림 구독:', subscriber);
        });

        // 세션 연결
        await session.connect(token);
        console.log('🎥 OpenVidu 연결 성공');
      } catch (error) {
        console.error('❌ OpenVidu 연결 실패:', error);
      }
    };

    // 📌 WebSocket (채팅) 연결
    const socket = new SockJS('https://www.bobissue.store/ws/chat') // ✅ WebSocket 엔드포인트
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

    // 🌟 클라이언트를 먼저 저장 후 활성화
    stompClientRef.current = client
    client.activate()

    connectToSession() // ✅ OpenVidu 연결

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        console.log('❌ 웹소켓 연결 종료')
      }

      if (sessionRef.current) {
        sessionRef.current.disconnect()
        console.log('❌ OpenVidu 세션 종료')
      }
    }
  }, [sessionId]) // sessionId가 변경될 때마다 실행

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

  return (
    <div className='w-full max-w-lg h-[600px] bg-white shadow-lg rounded-lg p-4 overflow-y-auto'>
      <h2 className='text-lg font-bold mb-2 text-center'>📺 라이브 방송 & 채팅</h2>

      {/* 📌 방송 화면 */}
      <div className='relative border rounded-lg shadow-md bg-black w-full mx-auto mb-4'>
        <video ref={videoRef} autoPlay playsInline className='w-full h-[300px] bg-black'></video>
      </div>

      {/* 📌 채팅 메시지 */}
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

      {/* 📌 메시지 입력창 */}
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
