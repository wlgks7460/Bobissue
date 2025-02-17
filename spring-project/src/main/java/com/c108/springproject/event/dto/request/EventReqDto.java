package com.c108.springproject.event.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventReqDto {
    private String name;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private List<Long> KeepImageNos;
}
