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
public class ReportCreateReqDto {
    private int categoryNo;
    private String title;
    private String content;
    private String createdUser;
}
