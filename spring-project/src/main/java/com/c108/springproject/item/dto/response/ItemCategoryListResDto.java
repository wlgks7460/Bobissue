package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.ItemCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemCategoryListResDto {
    private int categoryNo;
    private String name;
    private Integer parentNo;
    private List<ItemCategoryResDto> children;
//    private String createdAt;
//    private String updatedAt;
    public static ItemCategoryListResDto toDto(ItemCategory category) {
        return ItemCategoryListResDto.builder()
                .categoryNo(category.getCategoryNo())
                .name(category.getName())
//                .createdAt(category.getCreatedAt())
                .parentNo(category.getParent() != null ? category.getParent().getCategoryNo() : null)
                .children(category.getChildren().stream()
                        .map(child -> ItemCategoryResDto.builder()
                                .categoryNo(child.getCategoryNo())
                                .name(child.getName())
                                .createdAt(child.getCreatedAt())
                                .parentNo(child.getParent() != null ? child.getParent().getCategoryNo() : null)
                                .updatedAt(child.getUpdatedAt())
                                .build())
                        .collect(Collectors.toList()))
//                .updatedAt(category.getUpdatedAt())
                .build();

    }
}