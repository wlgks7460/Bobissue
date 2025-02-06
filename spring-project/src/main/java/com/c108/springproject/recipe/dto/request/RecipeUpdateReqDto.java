package com.c108.springproject.recipe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeUpdateReqDto {
    private int categoryNo;
    private String name;
    private int time;
    private int updatedUser;
    private List<MaterialReqDto> materials;
    private List<Long> keepImageIds; // 유지할 이미지를 받을 곳
}
