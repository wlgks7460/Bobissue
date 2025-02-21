package com.c108.springproject.global.websocket.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {


    //WebSocket Session들을 관리하는 리스트입니다.
    private static final ConcurrentHashMap<String, WebSocketSession> clientSession = new ConcurrentHashMap<>();

    //WebSocket 연결이 준비 되면 호출 된다. 연결을 성공하면 session 추가
    @Override
    public void afterConnectionEstablished(WebSocketSession session)throws  Exception{
        System.out.println("afterConnectionEstablished :: " + session.getId());
        clientSession.put(session.getId(), session);
    }

    // 새로운 WebSocket 메세지가 도착했을 때 호출
    // 전달 받은 메세지를 순회하면서 메세지를 전송
    // message.getPayload()를 통해 메서지가 전달
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)throws Exception{
        System.out.println("handleTextMessage :: "  + session);
        System.out.println("handleTextMessage :: " + message.getPayload());

        clientSession.forEach((key, value) -> {
            System.out.println("key :: " + key + " value :: "+ value);
//            if (!key.equals(session.getId())) {  //같은 아이디가 아니면 메시지를 전달합니다.
                try {
                    value.sendMessage(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
//            }
        });
    }

    //WebSocket 연결이 어느쪽에서 종료되든 전송 로류가 발생했을 때, 해당 세션을 제거합니다.
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)throws IOException{
        clientSession.remove(session);
        System.out.println("afterConnectionClosed remove Session " + session.getId() + "CloseStatus : " + status);
    }
}
