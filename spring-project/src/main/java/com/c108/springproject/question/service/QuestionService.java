package com.c108.springproject.question.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.dto.QuestionReqDto;
import com.c108.springproject.question.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Transactional
    public Question createQuestion(QuestionReqDto questionReqDto) {
        Question new_question = Question.builder()
                .title(questionReqDto.getTitle())
                .content(questionReqDto.getContent())
                .category(questionReqDto.getCategory())
                .isPrivate(questionReqDto.getIsPrivate())
                .status(questionReqDto.getStatus())
                .build();
        return questionRepository.save(new_question);
    }

    @Transactional
    public List<Question> findAllQuestions() {
        return questionRepository.findAll();
    }

    @Transactional
    public Question findQuestionByNo(Long question_no) {
        return questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
    }
}
