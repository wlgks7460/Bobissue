package com.c108.springproject.event.dto.response;

import com.c108.springproject.event.domain.Event;
import com.c108.springproject.event.dto.request.EventImageReqDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class EventDetailResDto {

    private int eventNo;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String status;
    private List<EventImageReqDto> images;

    public static EventDetailResDto toDto(Event event) {
        return EventDetailResDto.builder()
                .eventNo(event.getEventNo())
                .title(event.getTitle())
                .description(event.getDescription())
                .images(event.getImages().stream()
                        .map(EventImageReqDto::toDto)
                        .collect(Collectors.toList()))
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .status(event.getStatus())
                .build();
    }
}
