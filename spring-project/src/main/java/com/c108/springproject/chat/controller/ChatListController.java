package com.c108.springproject.chat.controller;

import com.c108.springproject.cast.dto.response.CastResDto;
import com.c108.springproject.chat.dto.ChatListDto;
import com.c108.springproject.chat.service.ChatListService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/castList")
public class ChatListController {

    private final ChatListService chatListService;

    public ChatListController(ChatListService chatListService){
        this.chatListService = chatListService;
    }

    @GetMapping("")
    public ResponseDto findAllChatList(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_CHAT_LIST, new DefaultResponse.ListResponse<ChatListDto>(chatListService.findAllChatList()));
    }


    @GetMapping("/{cast_no}")
    public ResponseDto findChatList(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CHAT_LIST_BY_CAST, new DefaultResponse<ChatListDto>(chatListService.findChatList(cast_no)));
    }
}
