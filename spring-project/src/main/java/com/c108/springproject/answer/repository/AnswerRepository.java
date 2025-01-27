package com.c108.springproject.answer.repository;

import com.c108.springproject.answer.domain.Answer;
import com.c108.springproject.question.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    Optional<Answer> findByQuestionNo(Question questionNo);
}
