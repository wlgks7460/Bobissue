package com.c108.springproject.item.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemCategoryResDto {
    private int categoryNo;
    private String name;
    private String createdAt;
    private String updatedAt;
}
