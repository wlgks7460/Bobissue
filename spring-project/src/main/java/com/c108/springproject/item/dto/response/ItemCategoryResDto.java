package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.Item;
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
public class ItemCategoryResDto {
    private int categoryNo;
    private String name;
    private Integer parentNo;
//    private List<ItemCategoryResDto> children;
    private String createdAt;
    private String updatedAt;
    private List<Item> items;

    public static ItemCategoryResDto toDto(ItemCategory category) {
        return ItemCategoryResDto.builder()
                .categoryNo(category.getCategoryNo())
                .name(category.getName())
                .parentNo(category.getParent() != null ? category.getParent().getCategoryNo() : null)
//                .children(category.getChildren().stream()
//                        .map(ItemCategoryResDto::toDto)
//                        .collect(Collectors.toList()))
                .createdAt(category.getCreatedAt().toString())
                .updatedAt(category.getUpdatedAt().toString())
                .items(category.getItems())
                .build();
    }
}
