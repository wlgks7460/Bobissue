package com.c108.springproject.cast.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CastItemResDto {
    private int itemNo;
    private String name;
    private String description;
}
