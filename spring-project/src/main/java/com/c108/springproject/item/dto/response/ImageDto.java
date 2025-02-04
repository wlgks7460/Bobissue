package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.ItemImage;
import lombok.*;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ImageDto {
    private Long imageNo;
    private String imageUrl;
    private String originalName;

    public static ImageDto toDto(ItemImage image) {
        return ImageDto.builder()
                .imageNo(image.getImageNo())
                .imageUrl(image.getImageUrl())
                .originalName(image.getOriginalName())
                .build();
    }
}
