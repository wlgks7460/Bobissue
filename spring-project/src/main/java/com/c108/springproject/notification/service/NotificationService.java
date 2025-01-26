package com.c108.springproject.notification.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.notification.domain.Notification;
import com.c108.springproject.notification.domain.NotificationRead;
import com.c108.springproject.notification.dto.request.NotificationReqDto;
import com.c108.springproject.notification.dto.response.NotificationResDto;
import com.c108.springproject.notification.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(NotificationReqDto notificationReqDto) {
        try {
            Notification new_notification = Notification.builder()
                    .adminNo(1)
                    .title(notificationReqDto.getTitle())
                    .content(notificationReqDto.getContent())
                    .reader(NotificationRead.valueOf(notificationReqDto.getReader()))
                    .build();
            return notificationRepository.save(new_notification);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_CREATE_NOTICE);
        }
    }

    @Transactional
    public List<NotificationResDto> findAllNotifications(){
        try{
            List<Notification> notifications = notificationRepository.findAll();
            List<NotificationResDto> notificationResDtos = new ArrayList<>();
            for(Notification notification : notifications){
                notificationResDtos.add(NotificationResDto.toDto(notification));
            }
            return notificationResDtos;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_FIND_ALL_NOTICE);
        }
    }

    @Transactional
    public NotificationResDto findNotificationByNo(int notification_no){
        Notification notification = notificationRepository.findByNoticeNo(notification_no).orElseThrow(() -> new BobIssueException(ResponseCode.NOTICE_NOT_FOUND));
        return NotificationResDto.toDto(notification);
    }

    @Transactional
    public NotificationResDto updateNotification(int notification_no, NotificationReqDto notificationReqDto){
        Notification notification = notificationRepository.findByNoticeNo(notification_no).orElseThrow(() -> new BobIssueException(ResponseCode.NOTICE_NOT_FOUND));
        try{
            notification.updateNotification(notificationReqDto);
            return NotificationResDto.toDto(notification);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_NOTICE);
        }
    }

    @Transactional
    public int deleteNotification(int notification_no){
        Notification notification = notificationRepository.findByNoticeNo(notification_no).orElseThrow(() -> new BobIssueException(ResponseCode.NOTICE_NOT_FOUND));
        try{
            notification.delete();
            return notification_no;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_NOTICE);
        }
    }
}
