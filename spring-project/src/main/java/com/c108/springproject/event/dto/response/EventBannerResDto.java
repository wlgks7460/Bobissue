package com.c108.springproject.event.dto.response;

import com.c108.springproject.event.domain.Event;
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
    private EventImage image;

    public static EventBannerResDto toDto(Event event) {
        return EventBannerResDto.builder()
                .eventNo(event.getEventNo())
                .image(event.getImages().get(0))
                .build();
    }
}
