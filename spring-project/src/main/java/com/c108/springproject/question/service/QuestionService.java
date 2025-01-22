package com.c108.springproject.question.service;

import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.dto.QuestionReqDto;
import com.c108.springproject.question.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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
}
