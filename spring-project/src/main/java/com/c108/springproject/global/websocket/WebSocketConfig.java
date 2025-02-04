package com.c108.springproject.global.websocket;


import com.c108.springproject.global.websocket.handler.ChatWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    private final ChatWebSocketHandler chatWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("최초의 WebSocket 연결을 위한 등록 Handler");
        registry
                //클라이언트에서 웹소켓 연결을 위해 "ws-stomp"라는 엔드포인트로 연결을 시도하면 ChatWebSocketHandler 클래스에서 이를 처리함
                .addHandler(chatWebSocketHandler, "/ws")
                //접속 시도하는 모든 도메인 또는 IP에서 WebSocket 연결을 허용합니다.
                .setAllowedOrigins("*");
    }
}
