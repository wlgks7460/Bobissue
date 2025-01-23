package com.c108.springproject.question.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.dto.request.QuestionReqDto;
import com.c108.springproject.question.dto.request.QuestionUpdateReqDto;
import com.c108.springproject.question.dto.response.QuestionResDto;
import com.c108.springproject.question.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/question")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService){
        this.questionService = questionService;
    }

    @PostMapping("/")
    public ResponseDto createQuestion(@RequestBody QuestionReqDto questionReqDto){
        System.out.println(questionReqDto);
        Question question = questionService.createQuestion(questionReqDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_QUESTION, new DefaultResponse<Long>(question.getQuestionNo()));
    }


    @GetMapping("/")
    public ResponseDto findAllQuestions(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_QUESTION, new DefaultResponse.ListResponse<QuestionResDto>(questionService.findAllQuestions()));
    }

    @GetMapping("/{question_no}")
    public ResponseDto findQuestionByNo(@PathVariable Long question_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_QUESTION, new DefaultResponse<QuestionResDto>(questionService.findQuestionByNo(question_no)));
    }

    @PutMapping("/{question_no}")
    public ResponseDto updateQuestionByNo(@PathVariable Long question_no, @RequestBody QuestionUpdateReqDto questionUpdateReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_QUESTION, new DefaultResponse<QuestionResDto>(questionService.updateQuestion(question_no, questionUpdateReqDto)));
    }



}
