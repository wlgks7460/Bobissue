package com.c108.springproject.notification.service;

import com.c108.springproject.notification.domain.Notification;
import com.c108.springproject.notification.domain.NotificationRead;
import com.c108.springproject.notification.dto.NotificationReadReqDto;
import com.c108.springproject.notification.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(NotificationReadReqDto notificationReadReqDto) {
        Notification new_notification = Notification.builder()
                .adminNo(1)
                .title(notificationReadReqDto.getTitle())
                .content(notificationReadReqDto.getContent())
                .createdAt("2020-01-10")
                .updatedAt("2020-01-10")
                .reader(NotificationRead.valueOf(NotificationRead.USER.toString()))
                .build();
        return notificationRepository.save(new_notification);
    }
}
