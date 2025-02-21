package com.c108.springproject.notification.dto.request;


import com.c108.springproject.notification.domain.NotificationRead;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationReqDto {
    private String title;
    private String content;
    private String reader;
}
