package com.c108.springproject.question.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.dto.QuestionReqDto;
import com.c108.springproject.question.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/question")
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


}
