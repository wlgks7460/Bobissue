package com.c108.springproject.review.dto.response;

import com.c108.springproject.review.domain.Report;
import com.c108.springproject.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportListResDto {
    private Long reportNo;
    private Long reviewNo;
    private String categoryName;
    private String title;
    private String status;
    private String createdAt;
    private int createdUser;


    public static ReportListResDto from(Report report) {
        return ReportListResDto.builder()
                .reportNo(report.getReportNo())
                .reviewNo(report.getReview().getReviewNo())
                .categoryName(report.getCategory().getName())
                .title(report.getTitle())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .createdUser(report.getCreatedUser())
                .build();
    }
}
