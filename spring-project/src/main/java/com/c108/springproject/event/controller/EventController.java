package com.c108.springproject.event.controller;

import com.c108.springproject.event.dto.request.EventReqDto;
import com.c108.springproject.event.dto.response.EventBannerResDto;
import com.c108.springproject.event.dto.response.EventDetailResDto;
import com.c108.springproject.event.service.EventService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/evnet")
public class EventController {

    private EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // 배너 조회
//    @GetMapping("/banner")
//    public ResponseDto findBanner() {
//        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_EVENT_BANNER, new DefaultResponse<List<EventBannerResDto>>(eventService.getBanner()));
//    }

    // 배너 상세 조회
    @GetMapping("/{eventNo}")
    public ResponseDto findEvent(@PathVariable int eventNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_EVENT, new DefaultResponse<EventDetailResDto>(eventService.getEventDetail(eventNo)));
    }

    // 이벤트 작성
    @PostMapping
    public ResponseDto createEvent(
            @RequestPart(value = "event") String eventString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images){
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        EventReqDto eventReqDto = objectMapper.convertValue(eventString, EventReqDto.class);

        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_CREATE_EVENT, new DefaultResponse<EventDetailResDto>(eventService.createEvent(eventReqDto, images)));
    }

    // 이벤트 수정
    @PutMapping("/{eventNo}")
    public ResponseDto updateEvent(
            @PathVariable int eventNo,
            @RequestPart(value = "event") String eventString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images){
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        EventReqDto eventReqDto = objectMapper.convertValue(eventString, EventReqDto.class);

        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_EVENT, new DefaultResponse<EventDetailResDto>(eventService.updateEvent(eventNo, eventReqDto, images)));
    }

    // 이벤트 삭제
    @DeleteMapping("/{eventNo}")
    public ResponseDto deleteEvent(@PathVariable int eventNo){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_EVENT, new DefaultResponse<Integer>(eventService.deleteEvent(eventNo)));
    }

}
