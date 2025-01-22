package com.c108.springproject.notification.dto;


import com.c108.springproject.notification.domain.NotificationRead;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationReadReqDto {
    private String title;
    private String content;
    private String createdAt;
    private String updatedAt;
    private NotificationRead read;
}
