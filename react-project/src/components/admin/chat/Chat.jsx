// // // // // ✅ 필요 시 자동으로 window.global 정의
// // // // window.global = window

// // // // import React, { useState, useEffect, useRef } from 'react'
// // // // import SockJS from 'sockjs-client' // ✅ SockJS 사용
// // // // import { Client } from '@stomp/stompjs' // ✅ STOMP 클라이언트
// // // // import { OpenVidu } from 'openvidu-browser' // ✅ OpenVidu 라이브러리 추가

// // // // const ChatRoom = ({ sessionId }) => {
// // // //   const [messages, setMessages] = useState([]) // 메시지 상태 관리
// // // //   const [message, setMessage] = useState('') // 입력된 메시지
// // // //   const stompClientRef = useRef(null) // WebSocket 클라이언트 저장
// // // //   const videoRef = useRef(null) // 📌 시청자 비디오 화면 참조
// // // //   const sessionRef = useRef(null) // 📌 OpenVidu 세션 객체 참조

// // // //   useEffect(() => {
// // // //     // 📌 OpenVidu 세션 연결 (시청자)
// // // //     // const connectToSession = async () => {
// // // //     //   // try {
// // // //     //     console.log(`🔍 OpenVidu 연결 시도: 세션 ID = mySession1`)

        
// // // //     //       // ✅ Connection 생성 요청 (토큰 발급)
// // // //     //       const tokenRes = await fetch(
// // // //     //         `https://bobissue.store/api/openvidu/sessions/${sessionId}/token`,
// // // //     //         {
// // // //     //           method: 'POST',
// // // //     //           headers: {
// // // //     //             'Content-Type': 'application/json',
// // // //     //             Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
// // // //     //           },
// // // //     //           body: JSON.stringify({}),
// // // //     //         }
// // // //     //   );
      
// // // //     //   if (!tokenRes.ok) {
// // // //     //     throw new Error(`❌ 서버 응답 오류: ${tokenRes.status}`);
// // // //     //   }

// // // //     //   const { token } = await tokenRes.json();

// // // //     //       // OpenVidu 클라이언트 연결
// // // //     //       const OV = new OpenVidu();
// // // //     //       const newSession = OV.initSession();

// // // //     //       newSession.on('streamCreated', (event) => {
// // // //     //         const subscriber = newSession.subscribe(event.stream, videoRef.current);
// // // //     //         console.log('📺 새로운 스트림 구독:', subscriber);
// // // //     //       });

// // // //     //       await newSession.connect(token)

// // // //     //   //   // ✅ 응답이 정상적인지 확인
// // // //     //   //   if (!tokenRes.ok) {
// // // //     //   //     throw new Error(`❌ 서버 응답 오류: ${tokenRes.status} ${tokenRes.statusText}`)
// // // //     //   //   }

// // // //     //   //   // ✅ JSON 파싱
// // // //     //   //   const tokenData = await tokenRes.json()
// // // //     //   //   console.log('✅ 시청자 토큰 발급 성공:', tokenData.token)

// // // //     //   //   // ✅ OpenVidu 초기화
// // // //     //   //   const OV = new OpenVidu()
// // // //     //   //   const session = OV.initSession()
// // // //     //   //   sessionRef.current = session

// // // //     //   //   session.on('streamCreated', (event) => {
// // // //     //   //     const subscriber = session.subscribe(event.stream, videoRef.current)
// // // //     //   //     console.log('📺 새로운 스트림 구독:', subscriber)
// // // //     //   //   })

// // // //     //   //   await session.connect(tokenData.token)
// // // //     //   //   console.log('🎥 시청자 OpenVidu 연결 성공')
// // // //     //   // } catch (error) {
// // // //     //   //   console.error('❌ 시청자 OpenVidu 연결 실패:', error)
// // // //     //   // }

// // // //     //   // console.log(`🔍 OpenVidu 연결 시도: 세션 ID = ${sessionId}`)
      
// // // //     // }

// // // //     // const connectToSession = async () => {
// // // //     //   try {
// // // //     //     console.log(`🔍 OpenVidu 연결 시도: 세션 ID = ${sessionId}`);
        
// // // //     //     // 토큰 발급 요청
// // // //     //     const tokenRes = await fetch(`https://bobissue.store/api/openvidu/sessions/mySession3/token`, {
// // // //     //       method: 'POST',
// // // //     //       headers: {
// // // //     //         'Content-Type': 'application/json',
// // // //     //         Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'), // 인증 헤더
// // // //     //       },
// // // //     //       body: JSON.stringify({}),
// // // //     //     });
        
// // // //     //     if (!tokenRes.ok) {
// // // //     //       throw new Error(`❌ 서버 응답 오류: ${tokenRes.status}`);
// // // //     //     }

// // // //     //     const { token } = await tokenRes.json();


// // // //     //     // 토큰 값 로그 출력
// // // //     //     console.log("✅ 서버에서 받은 토큰:", token);
        
// // // //     //     // OpenVidu 세션 초기화 및 연결
// // // //     //     const OV = new OpenVidu();
// // // //     //     const session = OV.initSession();
// // // //     //     sessionRef.current = session;

// // // //     //     session.on('streamCreated', (event) => {
// // // //     //       session.subscribe(event.stream, videoRef.current);
// // // //     //       console.log('📺 새로운 스트림 구독');
// // // //     //     });

// // // //     //     await session.connect(token);
// // // //     //     console.log('🎥 OpenVidu 연결 성공');
// // // //     //   } catch (error) {
// // // //     //     console.error('❌ OpenVidu 연결 실패:', error);
// // // //     //   }
// // // //     // };

// // // //     const connectToSession = async () => {

// // // //       try {

// // // //         console.log(`🔍 OpenVidu 연결 시도: 세션 ID = ${sessionId}`);
    
// // // //         // // 토큰 발급 요청
// // // //         // const tokenRes = await fetch(`https://bobissue.store/api/openvidu/sessions/${sessionId}/token`, {
// // // //         //   method: 'POST',
// // // //         //   headers: {
// // // //         //     'Content-Type': 'application/json',
// // // //         //     Authorization: 'Basic ' + btoa('OPENVIDUAPP:C108bob'),
// // // //         //   },
// // // //         //   body: JSON.stringify({}),
// // // //         // });
        
// // // //         // if (!tokenRes.ok) {
// // // //         //   throw new Error(`❌ 서버 응답 오류: ${tokenRes.status}`);
// // // //         // }
    
// // // //         // const { token } = await tokenRes.json();
// // // //         // console.log("✅ 서버에서 받은 토큰:", token);
        
// // // //         // OpenVidu 세션 초기화 및 연결
// // // //         const OV = new OpenVidu();
// // // //         const session = OV.initSession();
// // // //         sessionRef.current = session;
    
// // // //         session.on('streamCreated', (event) => {
// // // //           const subscriber = session.subscribe(event.stream, videoRef.current);
// // // //           console.log('📺 새로운 스트림 구독:', subscriber);
// // // //         });
    
// // // //         await session.connect("tok_YMfrLoWC1ehvcnsgH");
// // // //         console.log('🎥 OpenVidu 연결 성공');

// // // //       } catch (error) {
// // // //         console.error('❌ OpenVidu 연결 실패:', error);
// // // //       }
// // // //     };

// // // //     // 📌 WebSocket (채팅) 연결
// // // //     const socket = new SockJS('https://www.bobissue.store/ws/chat') // ✅ WebSocket 엔드포인트
// // // //     const client = new Client({
// // // //       webSocketFactory: () => socket,
// // // //       reconnectDelay: 5000, // 자동 재연결 (5초)
// // // //       onConnect: () => {
// // // //         console.log('✅ 웹소켓 연결 완료')

// // // //         // 🌟 클라이언트 객체를 먼저 저장한 후 구독 설정
// // // //         stompClientRef.current = client

// // // //         client.subscribe('/sub/message', (message) => {
// // // //           const receivedMessage = JSON.parse(message.body)
// // // //           console.log('📩 받은 메시지:', receivedMessage)
// // // //           setMessages((prev) => [...prev, receivedMessage]) // 상태 업데이트
// // // //         })
// // // //       },
// // // //       onStompError: (frame) => {
// // // //         console.error('❌ STOMP 오류 발생:', frame)
// // // //       },
// // // //     })

// // // //     // 🌟 클라이언트를 먼저 저장 후 활성화
// // // //     stompClientRef.current = client
// // // //     client.activate()

// // // //     connectToSession() // ✅ OpenVidu 연결

// // // //     return () => {
// // // //       if (stompClientRef.current) {
// // // //         stompClientRef.current.deactivate()
// // // //         console.log('❌ 웹소켓 연결 종료')
// // // //       }

// // // //       if (sessionRef.current) {
// // // //         sessionRef.current.disconnect()
// // // //         console.log('❌ OpenVidu 세션 종료')
// // // //       }
// // // //     }
// // // //   }, [sessionId]) // sessionId가 변경될 때마다 실행

// // // //   // ✅ 메시지 전송 함수 (WebSocket 연결 여부 체크)
// // // //   const sendMessage = () => {
// // // //     if (!stompClientRef.current || !stompClientRef.current.connected) {
// // // //       console.warn('⚠️ 웹소켓이 아직 연결되지 않았습니다.')
// // // //       return
// // // //     }

// // // //     if (message.trim() !== '') {
// // // //       const chatMessage = { content: message }

// // // //       stompClientRef.current.publish({
// // // //         destination: '/pub/messages', // ✅ 백엔드에서 설정한 엔드포인트 확인
// // // //         body: JSON.stringify(chatMessage),
// // // //       })

// // // //       console.log('📤 메시지 전송:', chatMessage)
// // // //       setMessage('') // 입력창 초기화
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className='w-full max-w-lg h-[600px] bg-white shadow-lg rounded-lg p-4 overflow-y-auto'>
// // // //       <h2 className='text-lg font-bold mb-2 text-center'>📺 라이브 방송 & 채팅</h2>

// // // //       {/* 📌 방송 화면 */}
// // // //       <div className='relative border rounded-lg shadow-md bg-black w-full mx-auto mb-4'>
// // // //         <video ref={videoRef} autoPlay playsInline className='w-full h-[300px] bg-black'></video>
// // // //       </div>

// // // //       {/* 📌 채팅 메시지 */}
// // // //       <div className='h-64 overflow-y-auto border p-2 rounded-lg'>
// // // //         {messages.length === 0 ? (
// // // //           <p className='text-gray-500 text-center'>메시지가 없습니다.</p>
// // // //         ) : (
// // // //           messages.map((msg, index) => (
// // // //             <div key={index} className='p-2 border-b'>
// // // //               {msg.content}
// // // //             </div>
// // // //           ))
// // // //         )}
// // // //       </div>

// // // //       {/* 📌 메시지 입력창 */}
// // // //       <div className='mt-4 flex'>
// // // //         <input
// // // //           type='text'
// // // //           className='flex-1 p-2 border rounded-lg'
// // // //           value={message}
// // // //           onChange={(e) => setMessage(e.target.value)}
// // // //           placeholder='메시지를 입력하세요'
// // // //         />
// // // //         <button onClick={sendMessage} className='ml-2 p-2 bg-blue-500 text-white rounded-lg'>
// // // //           보내기
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default ChatRoom



// // // import React, { useEffect, useRef, useState } from "react";
// // // import { OpenVidu } from "openvidu-browser";
// // // import SockJS from "sockjs-client";
// // // import Stomp from "stompjs";
// // // import axios from "axios";

// // // const APPLICATION_SERVER_URL = "https://bobissue.store/";

// // // const ChatRoom = () => {
// // //   const [session, setSession] = useState(null);
// // //   const [publisher, setPublisher] = useState(null);
// // //   const [subscribers, setSubscribers] = useState([]);
// // //   const [messages, setMessages] = useState([]);
// // //   const [messageInput, setMessageInput] = useState("");
// // //   const [sessionId] = useState("cast");

// // //   const sessionRef = useRef(null);
// // //   const stompClientRef = useRef(null);
// // //   const videoContainerRef = useRef(null); // 영상을 표시할 컨테이너

// // //   useEffect(() => {
// // //     const initializeSession = async () => {
// // //       const OV = new OpenVidu();
// // //       const newSession = OV.initSession();

// // //       newSession.on("streamCreated", (event) => {
// // //         const subscriber = newSession.subscribe(event.stream, undefined);
// // //         setSubscribers((prev) => [...prev, subscriber]);
// // //       });

// // //       newSession.on("streamDestroyed", (event) => {
// // //         setSubscribers((prev) => prev.filter((sub) => sub !== event.stream));
// // //       });

// // //       const token = await getToken(sessionId);
// // //       await newSession.connect(token, { clientData: "User" });
      
// // //       const newPublisher = OV.initPublisher(undefined, {
// // //         audioSource: undefined,
// // //         videoSource: undefined,
// // //         publishAudio: true,
// // //         publishVideo: false,
// // //         resolution: "640x480",
// // //         frameRate: 30,
// // //         insertMode: "APPEND",
// // //         mirror: false,
// // //       });
// // //       newSession.publish(newPublisher);

// // //       setSession(newSession);
// // //       setPublisher(newPublisher);
// // //       sessionRef.current = newSession;
// // //     };

// // //     initializeSession();
// // //     setupWebSocket();

// // //     return () => {
// // //       sessionRef.current?.disconnect();
// // //       stompClientRef.current?.disconnect();
// // //     };
// // //   }, []);

// // //   const setupWebSocket = () => {
// // //     const socket = new SockJS(`${APPLICATION_SERVER_URL}ws/chat`);
// // //     const stompClient = Stomp.over(socket);
// // //     stompClient.connect({}, () => {
// // //       stompClient.subscribe("/topic/messages", (message) => {
// // //         setMessages((prev) => [...prev, JSON.parse(message.body)]);
// // //       });
// // //     });
// // //     stompClientRef.current = stompClient;
// // //   };

// // //   const getToken = async (sessionId) => {
// // //     const response = await axios.post(`https://bobissue.store/api/openvidu/sessions/${sessionId}/connections`, {});
// // //     console.log("확인좀할게요 " + response.data)
// // //     return response.data;
// // //   };

// // //   const sendMessage = () => {
// // //     if (stompClientRef.current && messageInput.trim()) {
// // //       stompClientRef.current.send("/app/chat.send", {}, JSON.stringify({
// // //         content: messageInput,
// // //         sender: "User",
// // //       }));
// // //       setMessageInput("");
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <h2>OpenVidu Chat Room</h2>
// // //       <div>
// // //         <h3>Messages</h3>
// // //         <ul>
// // //           {messages.map((msg, index) => (
// // //             <li key={index}>{msg.sender}: {msg.content}</li>
// // //           ))}
// // //         </ul>
// // //         <input
// // //           type="text"
// // //           value={messageInput}
// // //           onChange={(e) => setMessageInput(e.target.value)}
// // //           placeholder="Type a message..."
// // //         />
// // //         <button onClick={sendMessage}>Send</button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ChatRoom;



// // import React, { useEffect, useRef, useState } from "react";
// // import { OpenVidu } from "openvidu-browser";
// // import SockJS from "sockjs-client";
// // import Stomp from "stompjs";
// // import axios from "axios";

// // const APPLICATION_SERVER_URL = "https://bobissue.store/";

// // const ChatRoom = () => {
// //   const [session, setSession] = useState(null);
// //   const [subscribers, setSubscribers] = useState([]);
// //   const [messages, setMessages] = useState([]);
// //   const [messageInput, setMessageInput] = useState("");
// //   const [sessionId] = useState("cast"); // 기본 세션 ID 설정

// //   const sessionRef = useRef(null);
// //   const stompClientRef = useRef(null);
// //   const videoContainerRef = useRef(null); // 비디오 화면 표시용

// //   useEffect(() => {
// //     const initializeSession = async () => {
// //       const OV = new OpenVidu();
// //       const newSession = OV.initSession();

// //       // 📌 구독자(Subscriber)만 동작 (스트림 받아서 표시)
// //       newSession.on("streamCreated", (event) => {
// //         const subscriber = newSession.subscribe(event.stream, undefined);
// //         setSubscribers((prev) => [...prev, subscriber]);
// //         event.stream.addVideoElement(videoContainerRef.current); // 비디오 화면 표시
// //       });

// //       newSession.on("streamDestroyed", (event) => {
// //         setSubscribers((prev) => prev.filter((sub) => sub !== event.stream));
// //       });

// //       const token = await getToken(sessionId);
// //       await newSession.connect(token, { clientData: "Viewer" });

// //       setSession(newSession);
// //       sessionRef.current = newSession;
// //     };

// //     initializeSession();
// //     setupWebSocket();

// //     return () => {
// //       sessionRef.current?.disconnect();
// //       stompClientRef.current?.disconnect();
// //     };
// //   }, []);

// //   const setupWebSocket = () => {
// //     const socket = new SockJS(`${APPLICATION_SERVER_URL}ws/chat`);
// //     const stompClient = Stomp.over(socket);
// //     stompClient.connect({}, () => {
// //       stompClient.subscribe("/topic/messages", (message) => {
// //         setMessages((prev) => [...prev, JSON.parse(message.body)]);
// //       });
// //     });
// //     stompClientRef.current = stompClient;
// //   };

// //   const getToken = async (sessionId) => {
// //     const response = await axios.post(
// //       `https://bobissue.store/api/openvidu/sessions/${sessionId}/connections`,
// //       {}
// //     );
// //     console.log("📌 서버에서 받은 토큰:", response.data);
// //     return response.data;
// //   };

// //   const sendMessage = () => {
// //     if (stompClientRef.current && messageInput.trim()) {
// //       stompClientRef.current.send(
// //         "/app/chat.send",
// //         {},
// //         JSON.stringify({
// //           content: messageInput,
// //           sender: "User",
// //         })
// //       );
// //       setMessageInput("");
// //     }
// //   };

// //   return (
// //     <div className="w-full max-w-lg h-[600px] bg-white shadow-lg rounded-lg p-4">
// //       <h2 className="text-lg font-bold mb-2 text-center">📺 라이브 방송 시청 & 채팅</h2>

// //       {/* 📌 방송 화면 */}
// //       <div className="relative border rounded-lg shadow-md bg-black w-full mx-auto mb-4">
// //         <video ref={videoContainerRef} autoPlay playsInline className="w-full h-[300px] bg-black"></video>
// //       </div>

// //       {/* 📌 채팅 메시지 */}
// //       <div className="h-64 overflow-y-auto border p-2 rounded-lg">
// //         {messages.length === 0 ? (
// //           <p className="text-gray-500 text-center">메시지가 없습니다.</p>
// //         ) : (
// //           messages.map((msg, index) => (
// //             <div key={index} className="p-2 border-b">
// //               {msg.sender}: {msg.content}
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       {/* 📌 메시지 입력창 */}
// //       <div className="mt-4 flex">
// //         <input
// //           type="text"
// //           className="flex-1 p-2 border rounded-lg"
// //           value={messageInput}
// //           onChange={(e) => setMessageInput(e.target.value)}
// //           placeholder="메시지를 입력하세요"
// //         />
// //         <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
// //           보내기
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatRoom;


// //일단 가져오는것까지지
// // import React, { useEffect, useRef, useState } from "react";
// // import { OpenVidu } from "openvidu-browser";
// // import SockJS from "sockjs-client";
// // import Stomp from "stompjs";
// // import axios from "axios";

// // const APPLICATION_SERVER_URL = "https://bobissue.store/";

// // const ChatRoom = () => {
// //   const [session, setSession] = useState(null);
// //   const [subscribers, setSubscribers] = useState([]);
// //   const [messages, setMessages] = useState([]);
// //   const [messageInput, setMessageInput] = useState("");
// //   const [sessionId] = useState("cast"); // 기본 세션 ID 설정

// //   const sessionRef = useRef(null);
// //   const stompClientRef = useRef(null);
// //   const videoContainerRef = useRef(null); // 비디오 화면 표시용

// //   useEffect(() => {
// //     const initializeSession = async () => {
// //       const OV = new OpenVidu();
// //       const newSession = OV.initSession();

// //       // 📌 구독자(Subscriber)만 동작 (스트림 받아서 표시)
// //       newSession.on("streamCreated", (event) => {
// //         const subscriber = newSession.subscribe(event.stream, undefined);
// //         setSubscribers((prev) => [...prev, subscriber]);
// //         // event.stream.addVideoElement(videoContainerRef.current); // 비디오 화면 표시

// //         console.log("📌 Subscribing to", event.stream.connection.connectionId);
// //         console.log("📌 New video element associated to", subscriber);


// //         // 📌 비디오 컨테이너에 스트림 추가
// //         if (videoContainerRef.current) {
// //           const videoElement = document.createElement("video");
// //           videoElement.autoplay = true;
// //           videoElement.playsInline = true;
// //           videoElement.style.width = "100%";
// //           videoContainerRef.current.innerHTML = ""; // 기존 요소 제거
// //           videoContainerRef.current.appendChild(videoElement);
          
// //           // 📌 스트림을 비디오 요소에 연결
// //           subscriber.addVideoElement(videoElement);
// //         }
// //       });

// //       newSession.on("streamDestroyed", (event) => {
// //         setSubscribers((prev) => prev.filter((sub) => sub !== event.stream));
        
// //       });


// //       const token = await getToken(sessionId);
// //       await newSession.connect(token, { clientData: "Viewer" });

// //       setSession(newSession);
// //       sessionRef.current = newSession;
// //     };

// //     initializeSession();
// //     setupWebSocket();

// //     return () => {
// //       sessionRef.current?.disconnect();
// //       stompClientRef.current?.disconnect();
// //     };
// //   }, []);

// //   const setupWebSocket = () => {
// //     const socket = new SockJS(`${APPLICATION_SERVER_URL}ws/chat`);
// //     const stompClient = Stomp.over(socket);
// //     stompClient.connect({}, () => {
// //       stompClient.subscribe("/topic/messages", (message) => {
// //         setMessages((prev) => [...prev, JSON.parse(message.body)]);
// //       });
// //     });
// //     stompClientRef.current = stompClient;
// //   };

// //   const getToken = async (sessionId) => {
// //     const response = await axios.post(
// //       `https://bobissue.store/api/openvidu/sessions/jihancast/connections`,
// //       {}
// //     );
// //     console.log("📌 서버에서 받은 토큰:", response.data);
// //     return response.data;
// //   };

// //   const sendMessage = () => {
// //     if (stompClientRef.current && messageInput.trim()) {
// //       stompClientRef.current.send(
// //         "/app/chat.send",
// //         {},
// //         JSON.stringify({
// //           content: messageInput,
// //           sender: "User",
// //         })
// //       );
// //       setMessageInput("");
// //     }
// //   };

// //   return (
// //     <div className="w-full max-w-lg h-[600px] bg-white shadow-lg rounded-lg p-4">
// //       <video id="subscriber-video" autoplay playsinline></video>

// //       <h2 className="text-lg font-bold mb-2 text-center">📺 라이브 방송 시청 & 채팅</h2>

// //       {/* 📌 방송 화면 */}
// //       <div className="relative border rounded-lg shadow-md bg-black w-full mx-auto mb-4">
// //         <video ref={videoContainerRef} autoPlay playsInline className="w-full h-[300px] bg-black"></video>
// //       </div>

// //       {/* 📌 채팅 메시지 */}
// //       <div className="h-64 overflow-y-auto border p-2 rounded-lg">
// //         {messages.length === 0 ? (
// //           <p className="text-gray-500 text-center">메시지가 없습니다.</p>
// //         ) : (
// //           messages.map((msg, index) => (
// //             <div key={index} className="p-2 border-b">
// //               {msg.sender}: {msg.content}
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       {/* 📌 메시지 입력창 */}
// //       <div className="mt-4 flex">
// //         <input
// //           type="text"
// //           className="flex-1 p-2 border rounded-lg"
// //           value={messageInput}
// //           onChange={(e) => setMessageInput(e.target.value)}
// //           placeholder="메시지를 입력하세요"
// //         />
// //         <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
// //           보내기
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatRoom;

///확인용용
// import React, { useEffect, useRef, useState } from "react";
// import { OpenVidu } from "openvidu-browser";
// import SockJS from "sockjs-client";
// import Stomp from "stompjs";
// import axios from "axios";

// const APPLICATION_SERVER_URL = "https://bobissue.store/";

// const ChatRoom = () => {
//   const [session, setSession] = useState(null);
//   const [subscribers, setSubscribers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [sessionId] = useState("cast"); // 기본 세션 ID 설정

//   const sessionRef = useRef(null);
//   const stompClientRef = useRef(null);
//   const videoContainerRef = useRef(null); // 비디오 화면 표시용

//   useEffect(() => {
//     const initializeSession = async () => {
//       const OV = new OpenVidu();
//       const newSession = OV.initSession();

//       newSession.on("streamCreated", (event) => {
//         const subscriber = newSession.subscribe(event.stream, undefined);
//         setSubscribers((prev) => [...prev, subscriber]);

//         console.log("📌 Subscribing to", event.stream.connection.connectionId);

//         // 📌 상태값 업데이트 후 useEffect에서 비디오 바인딩
//       });

//       newSession.on("streamDestroyed", (event) => {
//         setSubscribers((prev) => prev.filter((sub) => sub !== event.stream));
//       });

//       const token = await getToken(sessionId);
//       await newSession.connect(token, { clientData: "Viewer" });

//       setSession(newSession);
//       sessionRef.current = newSession;
//     };

//     initializeSession();
//     setupWebSocket();

//     return () => {
//       sessionRef.current?.disconnect();
//       stompClientRef.current?.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (subscribers.length > 0 && videoContainerRef.current) {
//       console.log("🎥 비디오 스트림을 화면에 추가합니다.");

//       const videoElement = document.createElement("video");
//       videoElement.autoplay = true;
//       videoElement.playsInline = true;
//       videoElement.style.width = "100%";
      
//       videoContainerRef.current.innerHTML = ""; // 기존 요소 제거
//       videoContainerRef.current.appendChild(videoElement);

//       subscribers[subscribers.length - 1].addVideoElement(videoElement);
//       console.log("✅ 비디오 요소가 성공적으로 바인딩되었습니다.");
//     }
//   }, [subscribers]);

//   const setupWebSocket = () => {
//     const socket = new SockJS(`${APPLICATION_SERVER_URL}ws/chat`);
//     const stompClient = Stomp.over(socket);
//     stompClient.connect({}, () => {
//       stompClient.subscribe("/topic/messages", (message) => {
//         setMessages((prev) => [...prev, JSON.parse(message.body)]);
//       });
//     });
//     stompClientRef.current = stompClient;
//   };

//   const getToken = async (sessionId) => {
//     const response = await axios.post(
//       `https://bobissue.store/api/openvidu/sessions/jihancastt/connections`,
//       {}
//     );
//     console.log("📌 서버에서 받은 토큰:", response.data);
//     return response.data;
//   };

//   const sendMessage = () => {
//     if (stompClientRef.current && messageInput.trim()) {
//       stompClientRef.current.send(
//         "/app/chat.send",
//         {},
//         JSON.stringify({
//           content: messageInput,
//           sender: "User",
//         })
//       );
//       setMessageInput("");
//     }
//   };

//   return (
//     <div className="w-full max-w-lg h-[600px] bg-white shadow-lg rounded-lg p-4">
//       <h2 className="text-lg font-bold mb-2 text-center">📺 라이브 방송 시청 & 채팅</h2>

//       {/* 📌 방송 화면 */}
//       <div className="relative border rounded-lg shadow-md bg-black w-full mx-auto mb-4">
//         <div ref={videoContainerRef} className="w-full h-[300px] bg-black"></div>
//       </div>

//       {/* 📌 채팅 메시지 */}
//       <div className="h-64 overflow-y-auto border p-2 rounded-lg">
//         {messages.length === 0 ? (
//           <p className="text-gray-500 text-center">메시지가 없습니다.</p>
//         ) : (
//           messages.map((msg, index) => (
//             <div key={index} className="p-2 border-b">
//               {msg.sender}: {msg.content}
//             </div>
//           ))
//         )}
//       </div>

//       {/* 📌 메시지 입력창 */}
//       <div className="mt-4 flex">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded-lg"
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//           placeholder="메시지를 입력하세요"
//         />
//         <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
//           보내기
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;



import React, { useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs'
import axios from "axios";

const APPLICATION_SERVER_URL = "https://bobissue.store/";

const ChatRoom = () => {
  const [session, setSession] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [sessionId] = useState("cast"); // 기본 세션 ID 설정

  const sessionRef = useRef(null);
  const stompClientRef = useRef(null);
  const videoContainerRef = useRef(null); // 비디오 화면 표시용

  useEffect(() => {
    const initializeSession = async () => {
      const OV = new OpenVidu();
      const newSession = OV.initSession();

      // 📌 구독자(Subscriber)만 동작 (스트림 받아서 표시)
      newSession.on("streamCreated", (event) => {
        const subscriber = newSession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);

        console.log("📌 Subscribing to", event.stream.connection.connectionId);
        // console.log("📌 Stream Tracks:", event.stream.getMediaStream().getVideoTracks());

        if (event.stream.hasVideo) {
          console.log("✅ 스트림에 비디오 포함됨!");
        } else {
          console.log("❌ 스트림에 비디오 없음!");
        }
      });

      newSession.on("streamDestroyed", (event) => {
        setSubscribers((prev) => prev.filter((sub) => sub !== event.stream));
      });

      const token = await getToken(sessionId);
      await newSession.connect(token, { clientData: "Viewer" });

      setSession(newSession);
      sessionRef.current = newSession;
    };

    initializeSession();
    setupWebSocket();

    return () => {
      sessionRef.current?.disconnect();
      stompClientRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (subscribers.length > 0 && videoContainerRef.current) {
      setTimeout(() => {
        console.log("🎥 비디오 스트림을 화면에 추가합니다.");

        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = true;
        videoElement.style.width = "100%";

        videoContainerRef.current.innerHTML = "";
        videoContainerRef.current.appendChild(videoElement);

        // 📌 스트림을 비디오 요소에 바인딩
        subscribers[subscribers.length - 1].addVideoElement(videoElement);
        console.log("✅ 비디오 요소가 성공적으로 바인딩되었습니다.");
        console.log("📌 비디오 소스 정보:", videoElement.srcObject);
      }, 500); // 0.5초 딜레이
    }
  }, [subscribers]);

  const setupWebSocket = () => {
    // const socket = new SockJS(`${APPLICATION_SERVER_URL}ws/chat`);
    // const stompClient = Stomp.over(socket);
    // stompClient.connect({}, () => {
    //   stompClient.subscribe("/sub/message", (message) => {
    //     setMessages((prev) => [...prev, JSON.parse(message.body)]);
    //   });
    // });
    // stompClientRef.current = stompClient;
    console.log("webSocket 접속 시도");
        const socket = new SockJS('https://bobissue.store/ws/chat')
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
  };

  const getToken = async (sessionId) => {
    const response = await axios.post(
      `https://bobissue.store/api/openvidu/sessions/jihancastt/connections`,
      {}
    );
    console.log("📌 서버에서 받은 토큰:", response.data);
    return response.data;
  };

  // const sendMessage = () => {
  //   if (stompClientRef.current && messageInput.trim()) {
  //     stompClientRef.current.send(
  //       "/app/chat.send",
  //       {},
  //       JSON.stringify({
  //         content: messageInput,
  //         sender: "User",
  //       })
  //     );
  //     setMessageInput("");
  //   }
  // };
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
    <div className="w-full max-w-lg h-[600px] bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2 text-center">📺 라이브 방송 시청 & 채팅</h2>

      {/* 📌 방송 화면 */}
      <div className="relative border rounded-lg shadow-md bg-black w-full mx-auto mb-4">
        <div ref={videoContainerRef} className="w-full h-[300px] bg-black"></div>
      </div>

      {/* 📌 채팅 메시지 */}
      <div className="h-64 overflow-y-auto border p-2 rounded-lg">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">메시지가 없습니다.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="p-2 border-b">
              {msg.sender}: {msg.content}
            </div>
          ))
        )}
      </div>

      {/* 📌 메시지 입력창 */}
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
          보내기
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;


