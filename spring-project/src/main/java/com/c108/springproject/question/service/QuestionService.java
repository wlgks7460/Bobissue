package com.c108.springproject.question.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.domain.QuestionCategory;
import com.c108.springproject.question.domain.QuestionImage;
import com.c108.springproject.question.dto.request.QuestionReqDto;
import com.c108.springproject.question.dto.request.QuestionUpdateReqDto;
import com.c108.springproject.question.dto.response.QuestionResDto;
import com.c108.springproject.question.repository.QuestionRepository;
import com.c108.springproject.review.domain.ReviewImage;
import com.c108.springproject.review.repository.ReviewRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final S3Service s3Service;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public QuestionService(QuestionRepository questionRepository, S3Service s3Service, ItemRepository itemRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.s3Service = s3Service;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Question createQuestion(QuestionReqDto questionReqDto, List<MultipartFile> files) {
        Item item = itemRepository.findById(questionReqDto.getItemNo()).orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailAndDelYnAndStatus(email, "N", "Y")
                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));

        try {
            QuestionCategory category = QuestionCategory.valueOf(questionReqDto.getCategory());
            // 문의 생성
            Question new_question = Question.builder()
                    .title(questionReqDto.getTitle())
                    .item(item) // 아이템 번호가 0이면 기타 문의
                    .content(questionReqDto.getContent())
                    .category(category)
                    .isPrivate(questionReqDto.getIsPrivate())
                    .status("N")
                    .user(user)
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
    public QuestionResDto updateQuestion(Long question_no, QuestionUpdateReqDto questionUpdateReqDto, List<MultipartFile> files) {
        Question question = questionRepository.findByQuestionNo(question_no).orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        
        // 이미지 저장소
        List<QuestionImage> updatedImages = new ArrayList<>();
        
        // 유지할 이미지 처리
        if (questionUpdateReqDto.getKeepImageIds() != null && !questionUpdateReqDto.getKeepImageIds().isEmpty()) {
            updatedImages.addAll(question.getImages().stream()
                    .filter(img -> questionUpdateReqDto.getKeepImageIds().contains(img.getImageNo()))
                    .collect(Collectors.toList()));
        }

        // 삭제할 이미지 처리
        List<String> deleteUrls = question.getImages().stream()
                .filter(img -> questionUpdateReqDto.getKeepImageIds() == null ||
                        !questionUpdateReqDto.getKeepImageIds().contains(img.getImageNo()))
                .map(QuestionImage::getImageUrl)
                .collect(Collectors.toList());

        // 새 이미지 업로드 및 처리
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String imageUrl = s3Service.uploadFile("question", file);
                QuestionImage questionImage = QuestionImage.builder()
                        .question(question)
                        .originalName(file.getOriginalFilename())
                        .imageUrl(imageUrl)
                        .build();
                updatedImages.add(questionImage);
            }
        }
        
        // 이미지 데이터베이스 처리
        question.getImages().clear();
        question.getImages().addAll(updatedImages);

        // 삭제할 Url 처리
        if (!deleteUrls.isEmpty()) {
            s3Service.deleteFiles(deleteUrls);
        }
        
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
            // 이미지 삭제
            List<String> deleteUrls = question.getImages().stream()
                    .map(QuestionImage::getImageUrl)
                    .collect(Collectors.toList());

            if (!deleteUrls.isEmpty()) {
                s3Service.deleteFiles(deleteUrls);
            }

            question.getImages().clear();
            question.delete();
            return question_no;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_QUESTION);
        }
    }
}
