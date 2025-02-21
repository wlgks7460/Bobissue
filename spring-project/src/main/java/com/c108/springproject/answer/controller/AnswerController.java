package com.c108.springproject.answer.controller;

import com.c108.springproject.answer.domain.Answer;
import com.c108.springproject.answer.dto.request.AnswerReqDto;
import com.c108.springproject.answer.dto.response.AnswerResDto;
import com.c108.springproject.answer.service.AnswerService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/question/{question_no}/answer")
public class AnswerController {

    private final AnswerService answerService;


    public AnswerController(AnswerService answerService){
        this.answerService = answerService;
    }

    @PostMapping("")
    public ResponseDto createAnswer(@PathVariable Long question_no, @RequestBody AnswerReqDto answerReqDto){
        Answer answer = answerService.createAnswer(question_no, answerReqDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_ANSWER, new DefaultResponse<Long>(answer.getAnswerNo()));

    }

    @GetMapping("")
    public ResponseDto findAnswer(@PathVariable("question_no") Long question_no) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ANSWER, new DefaultResponse<AnswerResDto>(answerService.findAnswer(question_no)));
    }


    @PutMapping("")
    public ResponseDto updateAnswer(@PathVariable("question_no") Long question_no, @RequestBody AnswerReqDto answerReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_ANSWER, new DefaultResponse<AnswerResDto>(answerService.updateAnswer(question_no, answerReqDto)));
    }

    @DeleteMapping("")
    public ResponseDto deleteAnswer(@PathVariable("question_no") Long question_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_ANSWER, new DefaultResponse<Long>(answerService.deleteAnswer(question_no)));
    }
}
