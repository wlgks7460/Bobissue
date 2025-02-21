package com.c108.springproject.answer.service;

import com.c108.springproject.answer.domain.Answer;
import com.c108.springproject.answer.dto.request.AnswerReqDto;
import com.c108.springproject.answer.dto.response.AnswerResDto;
import com.c108.springproject.answer.repository.AnswerRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.repository.QuestionRepository;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.repository.SellerRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final SellerRepository sellerRepository;

    public AnswerService(AnswerRepository answerRepository, QuestionRepository questionRepository, SellerRepository sellerRepository){
        this.answerRepository =answerRepository;
        this.questionRepository = questionRepository;
        this.sellerRepository = sellerRepository;
    }

    @Transactional
    public Answer createAnswer(Long question_no, AnswerReqDto answerReqDto){
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Seller seller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        try{
            Answer new_answer = Answer.builder()
                    .questionNo(question)
                    .seller(seller)
                    .content(answerReqDto.getContent())
                    .status("N")
                    .build();
            return  answerRepository.save(new_answer);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_CREATE_ANSWER);
        }
    }

    @Transactional
    public AnswerResDto findAnswer(Long question_no){
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        Answer answer = answerRepository.findByQuestionNo(question).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ANSWER));
        answer.readAnswer();
        return AnswerResDto.toDto(answer);
    }

    @Transactional
    public AnswerResDto updateAnswer(Long question_no, AnswerReqDto answerReqDto){
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        Answer answer = answerRepository.findByQuestionNo(question).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ANSWER));
        try {
            answer.updateAnswer(answerReqDto);
            return AnswerResDto.toDto(answer);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_ANSWER);
        }
    }

    @Transactional
    public Long deleteAnswer(Long question_no){
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        Answer answer = answerRepository.findByQuestionNo(question).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ANSWER));
        try{
            answer.delete();
            return answer.getAnswerNo();
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_ANSWER);
        }
    }


}
