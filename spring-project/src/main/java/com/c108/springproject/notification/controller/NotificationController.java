package com.c108.springproject.notification.controller;

import com.c108.springproject.notification.domain.Notification;
import com.c108.springproject.notification.dto.NotificationReadReqDto;
import com.c108.springproject.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


    @GetMapping("/")
    public String createNotification() {
        NotificationReadReqDto notice = new NotificationReadReqDto();
        notice.setTitle("Hi");
        notice.setContent("HiHi");
        System.out.println("Hi");
        Notification notification  = notificationService.createNotification(notice);
        return "hi";
    }

}
