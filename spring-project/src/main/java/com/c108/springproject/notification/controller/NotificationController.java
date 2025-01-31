package com.c108.springproject.notification.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.notification.dto.request.NotificationReqDto;
import com.c108.springproject.notification.dto.response.NotificationResDto;
import com.c108.springproject.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


    @PostMapping("")
    public ResponseDto createNotification(@RequestBody NotificationReqDto notificationReqDto) {
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_NOTICE, new DefaultResponse<Integer>(notificationService.createNotification(notificationReqDto).getNoticeNo()));
    }

    @GetMapping("")
    public ResponseDto findAllNotifications(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_NOTICE, new DefaultResponse.ListResponse<NotificationResDto>(notificationService.findAllNotifications()));
    }

    @GetMapping("/user-only")
    public ResponseDto findUserNotifications(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_USER_NOTICE, new DefaultResponse.ListResponse<NotificationResDto>(notificationService.findUserNotifications()));
    }

    @GetMapping("/seller-only")
    public ResponseDto findSellerNotifications(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_SELLER_NOTICE, new DefaultResponse.ListResponse<NotificationResDto>(notificationService.findSellerNotifications()));
    }

    @GetMapping("/{notification_no}")
    public ResponseDto findNotificationByNo(@PathVariable int notification_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_NOTICE, new DefaultResponse<NotificationResDto>(notificationService.findNotificationByNo(notification_no)));
    }

    @PutMapping("/{notification_no}")
    public ResponseDto updateNotification(@PathVariable int notification_no, @RequestBody NotificationReqDto notificationReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_NOTICE, new DefaultResponse<NotificationResDto>(notificationService.updateNotification(notification_no, notificationReqDto)));
    }

    @DeleteMapping("/{notification_no}")
    public ResponseDto deleteNotification(@PathVariable int notification_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_NOTICE, new DefaultResponse<Integer>(notificationService.deleteNotification(notification_no)));
    }

}
