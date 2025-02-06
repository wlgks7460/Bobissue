package com.c108.springproject.question.controller;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.dto.request.QuestionReqDto;
import com.c108.springproject.question.dto.request.QuestionUpdateReqDto;
import com.c108.springproject.question.dto.response.QuestionResDto;
import com.c108.springproject.question.service.QuestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/question")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService){
        this.questionService = questionService;
    }

    @PostMapping(value = "", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE  // 이걸 추가
    })
    public ResponseDto createQuestion(
            @RequestPart(value = "question") String questionString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            QuestionReqDto questionReqDto = objectMapper.readValue(questionString, QuestionReqDto.class);
            Question question = questionService.createQuestion(questionReqDto, images);
            return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_QUESTION, new DefaultResponse<Long>(question.getQuestionNo()));

        } catch (Exception e) {
            e.printStackTrace();
            throw new BobIssueException(ResponseCode.FILE_UPLOAD_ERROR);
        }
    }


    @GetMapping("")
    public ResponseDto findAllQuestions(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_QUESTION, new DefaultResponse.ListResponse<QuestionResDto>(questionService.findAllQuestions()));
    }

    @GetMapping("/{question_no}")
    public ResponseDto findQuestionByNo(@PathVariable Long question_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_QUESTION, new DefaultResponse<QuestionResDto>(questionService.findQuestionByNo(question_no)));
    }

    @PutMapping(value = "/{question_no}")
    public ResponseDto updateQuestionByNo(@PathVariable Long question_no, @RequestBody QuestionUpdateReqDto questionUpdateReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_QUESTION, new DefaultResponse<QuestionResDto>(questionService.updateQuestion(question_no, questionUpdateReqDto)));
    }

    @DeleteMapping("{question_no}")
    public ResponseDto deleteQuestionByNo(@PathVariable Long question_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_QUESTION, new DefaultResponse<Long>(questionService.deleteQuestion(question_no)));
    }
}
