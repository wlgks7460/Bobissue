package com.c108.springproject.chat.domain;

import com.c108.springproject.chat.dto.ChatMessageDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "chat_list")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatList {

    @Id
    private String id;
    private int castId;
    private List<ChatMessageDto> messages;
    private String createdAt;
}
