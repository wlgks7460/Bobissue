package com.c108.springproject.event.dto.response;

import com.c108.springproject.event.domain.EventImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventBannerResDto {
    private int eventNo;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String status;
    private EventImage image;
}
