package com.c108.springproject.question.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.domain.QuestionCategory;
import com.c108.springproject.question.dto.request.QuestionReqDto;
import com.c108.springproject.question.dto.request.QuestionUpdateReqDto;
import com.c108.springproject.question.dto.response.QuestionResDto;
import com.c108.springproject.question.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Transactional
    public Question createQuestion(QuestionReqDto questionReqDto) {
        try {
            QuestionCategory category = QuestionCategory.valueOf(questionReqDto.getCategory());
            Question new_question = Question.builder()
                    .title(questionReqDto.getTitle())
                    .content(questionReqDto.getContent())
                    .category(category)
                    .isPrivate(questionReqDto.getIsPrivate())
                    .status("N")
                    .build();
            return questionRepository.save(new_question);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_CREATE_QUESTION);
        }

    }

    @Transactional
    public List<QuestionResDto> findAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        List<QuestionResDto> questionResDtos = new ArrayList<>();
        for(Question question : questions) {
            questionResDtos.add(QuestionResDto.toDto(question));
        }
        return questionResDtos;
    }

    @Transactional
    public QuestionResDto findQuestionByNo(Long question_no) {
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        question.readQuestion();
        return QuestionResDto.toDto(question);
    }

    @Transactional
    public QuestionResDto updateQuestion(Long question_no, QuestionUpdateReqDto questionUpdateReqDto) {
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        try{
            question.updateQuestion(questionUpdateReqDto);
            return QuestionResDto.toDto(question);
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_QUESTION);
        }
    }

    @Transactional
    public Long deleteQuestion(Long question_no){
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        try{
            question.delete();
            return question_no;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_QUESTION);
        }
    }
}
