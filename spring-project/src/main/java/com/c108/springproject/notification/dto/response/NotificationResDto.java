package com.c108.springproject.notification.dto.response;

import com.c108.springproject.notification.domain.Notification;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResDto {

    private int noticeNo;
    private String title;
    private String content;
    private int adminNo;
    private String createAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;
    private String delYN;

    public static NotificationResDto toDto(Notification notification){
        return NotificationResDto.builder()
                .noticeNo(notification.getNoticeNo())
                .title(notification.getTitle())
                .content(notification.getContent())
                .adminNo(notification.getAdminNo())
                .createAt(notification.getCreatedAt())
                .createdUser(notification.getCreatedUser())
                .updatedAt(notification.getUpdatedAt())
                .updatedUser(notification.getUpdatedUser())
                .delYN(notification.getDelYn())
                .build();
    }
}
