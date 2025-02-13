package com.c108.springproject.global.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker //webSocket 메세지 브로커 활성화
public class WebSocketStompBrokerConfig implements WebSocketMessageBrokerConfigurer {

    //메세지 브로커 옵션 구성
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        //구독(sub) : 접두사로 시작하는 메세지를 브로커가 처리하도록 설정합니다. 클라이언트는 이 접두사로 시작하는 주제를 구독하여 메세지를 받을 수 있습니다.
        //예를 들어, 소켓 통신에서 사용자가 특정 메세지를 받기 위해 "/sub" 이라는 prefix 기반 메세지를 수신하기 위해 Subcribe합니다.
        config.enableSimpleBroker("/sub");

        //발행(pub) : 접두사로 시작하는 메쇼ㅔ지는 @MessageMapping이 달린 메서드로 라우팅 됨. 클라이언트가 서버로 메세지를 보낼 때 이접두사를 사용합니다.
        //예를 들어, 소켓 통신에서 사용자가 특정 메세지를 전송하기 위해 "/pub"이라는 prefix 기반 메세지 전소을 위해  Publish합니다.
        config.setApplicationDestinationPrefixes("/pub");
    }

    //각각 특정 URL에 매핑되는 STOMP 엔드포인트를 등록하고, 선택적으로 SockJS 폴백 옵션을 활성화하고 구성합니다.
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        //addEndpoint : 클라이언트가 WebSocket에 연결하기 위한 엔드포이트를 "/ws-stomp"로 설정
        //withSockJs : webSocket을 지원하지 않는 브라우저에서도 SockJS를 통해 webSocket 기능을 사용할 수 있게 합니다.
        registry
                .addEndpoint("/ws/chat")
                .setAllowedOriginPatterns("http://localhost:5173", "http://bobissue.duckdns.org", "https://bobissue.duckdns.org")
                .withSockJS();
        registry
                .addEndpoint("/ws/live")
                .setAllowedOriginPatterns("http://localhost:5173", "http://bobissue.duckdns.org", "https://bobissue.duckdns.org")
                .withSockJS();
    }
}
