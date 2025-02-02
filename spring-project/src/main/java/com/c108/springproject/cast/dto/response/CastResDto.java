package com.c108.springproject.cast.dto.response;


import com.c108.springproject.cast.domain.Cast;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CastResDto {

    private int castNo;
    private String title;
    private String content;
    private String startAt;
    private int castTime;
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
                .createAt(cast.getCreatedAt())
                .createdUser(cast.getCreatedUser())
                .updatedAt(cast.getUpdatedAt())
                .updatedUser(cast.getUpdatedUser())
                .delYN(cast.getDelYn())
                .build();
    }
}
