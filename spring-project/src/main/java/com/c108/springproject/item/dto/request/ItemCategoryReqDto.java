package com.c108.springproject.item.dto.request;

import lombok.*;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemCategoryReqDto {
    private String name;
    private String createdAt;
    private String updatedAt;
}
