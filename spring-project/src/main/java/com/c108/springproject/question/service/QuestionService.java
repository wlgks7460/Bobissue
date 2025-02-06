package com.c108.springproject.question.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.domain.QuestionCategory;
import com.c108.springproject.question.domain.QuestionImage;
import com.c108.springproject.question.dto.request.QuestionReqDto;
import com.c108.springproject.question.dto.request.QuestionUpdateReqDto;
import com.c108.springproject.question.dto.response.QuestionResDto;
import com.c108.springproject.question.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final S3Service s3Service;

    public QuestionService(QuestionRepository questionRepository, S3Service s3Service) {
        this.questionRepository = questionRepository;
        this.s3Service = s3Service;
    }

    @Transactional
    public Question createQuestion(QuestionReqDto questionReqDto, List<MultipartFile> files) {
        try {
            QuestionCategory category = QuestionCategory.valueOf(questionReqDto.getCategory());
            // 문의 생성
            Question new_question = Question.builder()
                    .title(questionReqDto.getTitle())
                    .itemNo(questionReqDto.getItemNo()) // 아이템 번호가 0이면 기타 문의
                    .content(questionReqDto.getContent())
                    .category(category)
                    .isPrivate(questionReqDto.getIsPrivate())
                    .status("N")
                    .build();

            // 이미지 생성
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imageUrl = s3Service.uploadFile("question", file);

                    QuestionImage questionImage = QuestionImage.builder()
                            .question(new_question)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imageUrl)
                            .build();
                    new_question.getImages().add(questionImage);
                }
            }


            return questionRepository.save(new_question);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_CREATE_QUESTION);
        }

    }

    @Transactional
    public List<QuestionResDto> findAllQuestions() {
        try{
            List<Question> questions = questionRepository.findAll();
            List<QuestionResDto> questionResDtos = new ArrayList<>();
            for(Question question : questions) {
                questionResDtos.add(QuestionResDto.toDto(question));
            }
            return questionResDtos;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_FIND_ALL_QUESTION);
        }

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
