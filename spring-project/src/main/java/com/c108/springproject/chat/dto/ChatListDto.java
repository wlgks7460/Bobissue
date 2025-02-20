package com.c108.springproject.chat.dto;

import com.c108.springproject.cast.dto.response.CastItemResDto;
import com.c108.springproject.chat.domain.ChatList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatListDto {

    private String id;
    private int castId;
    private List<ChatMessageDto> messages;
    private String createdAt;

    public static ChatListDto toDto(ChatList chatList){
        return ChatListDto.builder()
                .id(chatList.getId())
                .castId(chatList.getCastId())
                .messages(chatList.getMessages().stream()
                        .map(message -> new ChatMessageDto(message.getContent(), message.getSender(), message.getRoomId()))
                        .collect(Collectors.toList()))
                .createdAt(chatList.getCreatedAt())
                .build();
    }
}
