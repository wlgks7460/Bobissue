package com.c108.springproject.review.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.review.dto.request.ReportCreateReqDto;
import com.c108.springproject.review.dto.request.ReportUpdateReqDto;
import com.c108.springproject.review.dto.response.ReportListResDto;
import com.c108.springproject.review.dto.response.ReportResDto;
import com.c108.springproject.review.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // 리뷰 신고
    @PostMapping("/item/{itemNo}/review/{reviewNo}/report")
    public ResponseDto createReport(@PathVariable Long reviewNo, @RequestBody ReportCreateReqDto request) {
        ReportResDto response = reportService.createReport(reviewNo, request);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_REPORT, new DefaultResponse<>(response));

    }

    // 관리자: 신고 상태 변경
    @PutMapping("/admin/report/{reportNo}")
    public ResponseDto updateReportStatus(@PathVariable Long reportNo, @RequestBody ReportUpdateReqDto request) {
        ReportResDto response = reportService.updateReportStatus(reportNo, request);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_REPORT, new DefaultResponse<>(response));

    }

    // 관리자전체 신고 목록 조회 (상태별 필터링 가능)
    @GetMapping("/admin/reports")
    public ResponseDto getAllReports(@RequestParam(required = false) String status) {
        List<ReportListResDto> response = reportService.getReportsByStatus(status);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_REPORT, new DefaultResponse<>(response));

    }

}