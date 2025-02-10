package com.c108.springproject.cast.dto.response;


import com.c108.springproject.cast.domain.Cast;
import com.c108.springproject.cast.domain.CastItem;
import com.c108.springproject.cast.dto.requset.CastItemReqDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class CastResDto {

    private int castNo;
    private String title;
    private String content;
    private String startAt;
    private int castTime;
    private List<CastItemResDto> castItemList;
    private String createAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;
    private String delYN;


    public static CastResDto toDto(Cast cast){
        return CastResDto.builder()
                .castNo(cast.getCastNo())
                .title(cast.getTitle())
                .content(cast.getContent())
                .startAt(cast.getStartAt())
                .castTime(cast.getCastTime())
                .castItemList(cast.getCastItems().stream()
                        .map(item -> new CastItemResDto(item.getItem().getItemNo(), item.getItem().getName(), item.getItem().getDescription()))
                        .collect(Collectors.toList()))
                .createAt(cast.getCreatedAt())
                .createdUser(cast.getCreatedUser())
                .updatedAt(cast.getUpdatedAt())
                .updatedUser(cast.getUpdatedUser())
                .delYN(cast.getDelYn())
                .build();
    }
}
