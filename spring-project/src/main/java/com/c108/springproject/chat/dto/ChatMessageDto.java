package com.c108.springproject.chat.dto;

import lombok.Data;

@Data
public class ChatMessageDto {
    private String content;
    private String sender;
    private int roomId;

    public ChatMessageDto(String content, String sender, int roomId){
        this.content = content;
        this.sender =sender;
        this.roomId = roomId;
    }
}
