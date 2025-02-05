package com.c108.springproject.review.dto.request;

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
public class ReviewUpdateReqDto {
    private Long imageNo;
    private String content;
    private int rating;
    private int updatedUser;
    private List<Long> keepImageIds;
}
