package com.c108.springproject.recipe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialReqDto {
    private int itemNo;
    private int cnt;
}
