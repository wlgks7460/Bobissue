package com.c108.springproject.recipe.dto.response;

import com.c108.springproject.recipe.domain.Material;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResDto {
    private int materialNo;
    private int itemNo;
    private String itemName;
    private int cnt;

    public static MaterialResDto toDto(Material material) {
        return MaterialResDto.builder()
                .materialNo(material.getMaterialNo())
                .itemNo(material.getItem().getItemNo())
                .itemName(material.getItem().getName())
                .cnt(material.getCnt())
                .build();
    }
}
