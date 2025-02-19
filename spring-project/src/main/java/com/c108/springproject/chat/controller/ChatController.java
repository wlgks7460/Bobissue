package com.c108.springproject.chat.controller;

import com.c108.springproject.chat.dto.ChatMessageDto;
import com.c108.springproject.chat.dto.SignalMessageDto;
import com.c108.springproject.chat.service.NickNameService;
import com.c108.springproject.global.redis.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.UUID;

@RestController
public class ChatController {

    private final SimpMessagingTemplate template;
    private final RedisService redisService;
    private final NickNameService nickNameService;

    @Autowired
    public ChatController(SimpMessagingTemplate template,
                          RedisService redisService,
                          NickNameService nickNameService){
        this.template = template;
        this.redisService = redisService;
        this.nickNameService = nickNameService;
    }

    @MessageMapping("/messages")
    //@DestinationVariable에 추가로 chattingRoomId를 괄호 쓰고 넣어줘야 파라미터 인식을 함.
    public ChatMessageDto send2( @RequestBody ChatMessageDto chatMessageDto) {
        System.out.println(chatMessageDto.getContent());
//        redisService.setValues("cast", chatMessageDto.getSender() + " " + chatMessageDto.getContent());
        chatMessageDto.setSender(nickNameService.generateRandomNickname());
        redisService.setValues("chat :" + chatMessageDto.getSender(), chatMessageDto.getContent());
        template.convertAndSend("/sub/message", chatMessageDto);       // 구독중인 모든 사용자에게 메시지를 전달합니다.
        return chatMessageDto;
    }

}