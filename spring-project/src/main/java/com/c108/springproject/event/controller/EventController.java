package com.c108.springproject.event.controller;

import com.c108.springproject.event.dto.request.EventReqDto;
import com.c108.springproject.event.dto.response.EventBannerResDto;
import com.c108.springproject.event.dto.response.EventDetailResDto;
import com.c108.springproject.event.service.EventService;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.dto.request.ItemCreateReqDto;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/event")
public class EventController {

    private EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // 배너 조회
    @GetMapping("/banner")
    public ResponseDto findBanner() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_EVENT_BANNER, new DefaultResponse<List<EventBannerResDto>>(eventService.getBanner()));
    }

    // 이벤트 조회
    @GetMapping("/{eventNo}")
    public ResponseDto findEvent(@PathVariable int eventNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_EVENT, new DefaultResponse<EventDetailResDto>(eventService.getEventDetail(eventNo)));
    }

    // 이벤트 작성
    @PostMapping(value = "",consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE  // 이걸 추가
    })
    public ResponseDto createEvent(
            @RequestPart(value = "event") String eventString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images){
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            EventReqDto eventReqDto = objectMapper.readValue(eventString, EventReqDto.class);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_CREATE_EVENT, new DefaultResponse<EventDetailResDto>(eventService.createEvent(eventReqDto, images)));
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_EVENT);
        }
    }

    // 이벤트 수정
    @PutMapping(value = "/{eventNo}",consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE
    })
    public ResponseDto updateEvent(
            @PathVariable int eventNo,
            @RequestPart(value = "event") String eventString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "keepImageNos", required = false) List<Integer> keepImageNos){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            EventReqDto eventReqDto = objectMapper.readValue(eventString, EventReqDto.class);

            System.out.println("0");
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_EVENT, new DefaultResponse<EventDetailResDto>(eventService.updateEvent(eventNo, eventReqDto, images, keepImageNos)));

        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_EVENT);
        }
    }

    // 이벤트 삭제
    @DeleteMapping("/{eventNo}")
    public ResponseDto deleteEvent(@PathVariable int eventNo){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_EVENT, new DefaultResponse<Integer>(eventService.deleteEvent(eventNo)));
    }

}
