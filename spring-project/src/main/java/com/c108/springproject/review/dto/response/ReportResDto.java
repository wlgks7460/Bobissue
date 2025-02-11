package com.c108.springproject.review.dto.response;

import com.c108.springproject.review.domain.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResDto {
    private Long reportNo;
    private Long reviewNo;
    private String reviewContent;     // 신고된 리뷰 내용
    private int categoryNo;
    private String categoryName;
    private String title;
    private String content;
    private String status;
    private String createdAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;

    public static ReportResDto toDto(Report report) {
        return ReportResDto.builder()
                .reportNo(report.getReportNo())
                .reviewNo(report.getReview().getReviewNo())
                .reviewContent(report.getReview().getContent())
                .categoryNo(report.getCategory().getCategoryNo())
                .categoryName(report.getCategory().getName())
                .title(report.getTitle())
                .content(report.getContent())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .createdUser(report.getCreatedUser())
                .updatedAt(report.getUpdatedAt())
                .updatedUser(report.getUpdatedUser())
                .build();
    }
}
