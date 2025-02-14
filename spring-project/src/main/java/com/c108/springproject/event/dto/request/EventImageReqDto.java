package com.c108.springproject.event.dto.request;

import com.c108.springproject.event.domain.Event;
import com.c108.springproject.event.domain.EventImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class EventImageReqDto {
    private int imageNo;
    private String imageUrl;
    private String originalName;

    public static EventImageReqDto toDto(EventImage event) {
        return EventImageReqDto.builder()
                .imageNo(event.getImageNo())
                .imageUrl(event.getImageUrl())
                .originalName(event.getOriginalName())
                .build();
    }
}
