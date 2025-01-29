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
    private BigInteger imageNo;
    private String name;
    private int time;
    private int updatedUser;
    private List<MaterialReqDto> materials;
}
