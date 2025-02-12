package com.c108.springproject.item.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class SearchResDto {
    List<ItemSearchListResDto> items;
    private int page;
    private int size;

}
