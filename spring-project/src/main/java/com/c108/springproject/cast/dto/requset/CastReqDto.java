package com.c108.springproject.cast.dto.requset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CastReqDto {

    private String title;
    private String content;
    private String startAt;
    private int castTime;

}
