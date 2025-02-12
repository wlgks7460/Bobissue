package com.c108.springproject.review.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.review.domain.Report;
import com.c108.springproject.review.domain.ReportCategory;
import com.c108.springproject.review.domain.Review;
import com.c108.springproject.review.dto.request.ReportCreateReqDto;
import com.c108.springproject.review.dto.request.ReportUpdateReqDto;
import com.c108.springproject.review.dto.response.ReportListResDto;
import com.c108.springproject.review.dto.response.ReportResDto;
import com.c108.springproject.review.repository.ReportCategoryRepository;
import com.c108.springproject.review.repository.ReportRepository;
import com.c108.springproject.review.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReviewRepository reviewRepository;
    private final ReportRepository reportRepository;
    private final ReportCategoryRepository categoryRepository;

    public ReportService(ReviewRepository reviewRepository,
                         ReportRepository reportRepository,
                         ReportCategoryRepository categoryRepository) {
        this.reviewRepository = reviewRepository;
        this.reportRepository = reportRepository;
        this.categoryRepository = categoryRepository;
    }

    // 리뷰 신고하기
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public ReportResDto createReport(Long reviewNo, ReportCreateReqDto request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String username = authentication.getName();

            String checkReport = "USER " + username;

            // 리뷰 확인
            Review review = reviewRepository.findById(reviewNo)
                    .orElseThrow(() -> new BobIssueException(ResponseCode.REVIEW_NOT_FOUND));

            // 카테고리 확인
            ReportCategory category = categoryRepository.findById(request.getCategoryNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));

            // 이미 동일한 사용자가 해당 리뷰를 신고했는지 확인
            if (reportRepository.existsByReviewAndCreatedUser(review, checkReport)) {
                throw new BobIssueException(ResponseCode.ALREADY_REPORTED);
            }

            // 필수 필드 검증
            validateReportCreateRequest(request);

            Report report = Report.builder()
                    .review(review)
                    .category(category)
                    .title(request.getTitle())
                    .content(request.getContent())
                    .status("N")  // 초기 상태는 접수
                    .build();

            report.setCreatedUser(request.getCreatedUser());
            report.setUpdatedUser(request.getCreatedUser());

            Report savedReport = reportRepository.save(report);

            long reportCount = reportRepository.countByReview(review);

            if (reportCount >= 5) {
                review.delete();
            }

            return ReportResDto.toDto(savedReport);
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_REPORT);
        }
    }

    // 신고 상태 변경 (관리자 전용)
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ReportResDto updateReportStatus(Long reportNo, ReportUpdateReqDto request) {
        try {
            Report report = reportRepository.findById(reportNo)
                    .orElseThrow(() -> new BobIssueException(ResponseCode.REPORT_NOT_FOUND));

            // 상태값 검증
            validateReportStatus(request.getStatus());

            report.updateStatus(request.getStatus());
            report.setUpdatedUser(request.getUpdatedUser());

            Report updatedReport = reportRepository.save(report);
            return ReportResDto.toDto(updatedReport);
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_REPORT);
        }
    }

    // 신고 목록 조회 (관리자 전용)
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<ReportListResDto> getReportsByStatus(String status) {
        try {
            // 상태값이 지정된 경우에만 검증
            if (status != null) {
                validateReportStatus(status);
            }

            List<Report> reports = status != null ?
                    reportRepository.findByStatus(status) :
                    reportRepository.findAll();

            return reports.stream()
                    .map(ReportListResDto::toDto)
                    .collect(Collectors.toList());
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_REPORT);
        }
    }

    // 신고 상태 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ReportResDto getReport(Long reportNo) {
        Report report = reportRepository.findById(reportNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.REPORT_NOT_FOUND));
        return ReportResDto.toDto(report);

    }


    // 신고 생성 요청 데이터 검증
    private void validateReportCreateRequest(ReportCreateReqDto request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BobIssueException(ResponseCode.INVALID_REPORT_TITLE);
        }
    }


    // 신고 상태값 검증(N은 접수, P는 처리 중 Y는 처리) 이건 좀 회의를 해봐야
    private void validateReportStatus(String status) {
        if (!status.matches("[NPY]")) {
            throw new BobIssueException(ResponseCode.INVALID_REPORT_STATUS);
        }
    }
}