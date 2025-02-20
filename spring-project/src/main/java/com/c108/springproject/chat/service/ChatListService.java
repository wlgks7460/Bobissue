package com.c108.springproject.chat.service;

import com.c108.springproject.cast.domain.Cast;
import com.c108.springproject.cast.dto.response.CastResDto;
import com.c108.springproject.chat.domain.ChatList;
import com.c108.springproject.chat.dto.ChatListDto;
import com.c108.springproject.chat.repository.ChatListRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatListService {

    private final ChatListRepository chatListRepository;

    public ChatListService(ChatListRepository chatListRepository){
        this.chatListRepository = chatListRepository;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<ChatListDto> findAllChatList(){
        System.out.println("일단 옴");
        try{
            List<ChatList> chatLists = chatListRepository.findAll();
            List<ChatListDto> chatListDtos = new ArrayList<>();
            for(ChatList chatList : chatLists){
                chatListDtos.add(ChatListDto.toDto(chatList));
            }
            return chatListDtos;
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.CHAT_LIST_NOT_FOUND);
        }
    }


    @Transactional
    public ChatListDto findChatList(int cast_no){
        ChatList chatList = chatListRepository.findByCastId(cast_no).orElseThrow(()  -> new BobIssueException(ResponseCode.CHAT_LIST_NOT_FOUND));
        return ChatListDto.toDto(chatList);
    }




}
