package com.c108.springproject.review.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewUpdateReqDto {
    private BigInteger imageNo;
    private String content;
    private int rating;
    private int updatedUser;
}
