package com.c108.springproject.recipe.dto.request;

import java.math.BigInteger;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeCreateReqDto {
    private int categoryNo;
    private Long imageNo;
    private String name;
    private int time;
    private int createdUser;
    private int updatedUser;
    private List<MaterialReqDto> materials;

}
