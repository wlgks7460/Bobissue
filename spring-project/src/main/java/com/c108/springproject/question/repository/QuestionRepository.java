package com.c108.springproject.question.repository;

import com.c108.springproject.question.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findByQuestionNo(Long questionNo);
    void deleteByQuestionNo(Long questionNo);
    List<Question> findByUser_UserNo(int userNo);
    Optional<Question> findByUser_UserNoAndQuestionNo(int userNo, Long questionNo);
}
