package com.c108.springproject.review.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemImage;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.review.domain.Report;
import com.c108.springproject.review.domain.ReportCategory;
import com.c108.springproject.review.domain.Review;
import com.c108.springproject.review.domain.ReviewImage;
import com.c108.springproject.review.dto.request.*;
import com.c108.springproject.review.dto.response.*;
import com.c108.springproject.review.repository.*;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReportRepository reportRepository;
    private final ReportCategoryRepository reportCategoryRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;



    public ReviewService(ReviewRepository reviewRepository,
                         ReportRepository reportRepository,
                         ReportCategoryRepository reportCategoryRepository,
                         ItemRepository itemRepository, UserRepository userRepository, S3Service s3Service) {
        this.reviewRepository = reviewRepository;
        this.reportRepository = reportRepository;
        this.reportCategoryRepository = reportCategoryRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }


    // 리뷰 생성
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public ReviewCreateResDto createReview(int itemNo, ReviewCreateReqDto request, List<MultipartFile> files) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isUser = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("USER"));

        if (!isUser) {
            throw new BobIssueException(ResponseCode.NOT_USER);
        }

        // 상품 확인
        itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        // 리뷰 평점 유효성 검사 (1-5점)
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BobIssueException(ResponseCode.INVALID_RATING);
        }

        Item item=itemRepository.findById(request.getItemNo()).orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
        Review review = Review.builder()
                .item(item)
//                .imageNo(request.getImageNo())
                .content(request.getContent())
                .rating(request.getRating())
                .build();

        // 이미지 업로드
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String imageUrl = s3Service.uploadFile("review", file);

                ReviewImage reviewImage = ReviewImage.builder()
                        .review(review)
                        .originalName(file.getOriginalFilename())
                        .imageUrl(imageUrl)
                        .build();
                review.getImages().add(reviewImage);
            }
        }
        
//        review.setCreatedUser(request.getCreatedUser());
//        review.setUpdatedUser(request.getCreatedUser());

        Review savedReview = reviewRepository.save(review);
        return ReviewCreateResDto.toDto(savedReview);
    }

    // 특정 상품의 리뷰 목록 조회
    @Transactional
    public List<ReviewListResDto> getReviewsByItem(int itemNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("ADMIN"));

        // 상품 확인
        itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

<<<<<<< spring-project/src/main/java/com/c108/springproject/review/service/ReviewService.java
        return reviewRepository.findByItemItemNoAndDelYn(itemNo, "N").stream()
=======
//        if (isAdmin) {
//            // 관리자는 모든 리뷰(삭제된 리뷰 포함) 조회
//            return reviewRepository.findByItemNo(itemNo).stream()
//                    .map(review -> {
//                        User user = userRepository.findByEmail(review.extractEmail())
//                                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));
//                        return ReviewListResDto.toDto(review, user);
//                    })
//                    .collect(Collectors.toList());
//        }


        return reviewRepository.findByItemNoAndDelYn(itemNo, "N").stream()
>>>>>>> spring-project/src/main/java/com/c108/springproject/review/service/ReviewService.java
                .map(review -> {
                    User user = userRepository.findByEmail(review.extractEmail())
                            .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));
                    return ReviewListResDto.toDto(review, user);
                })
                .collect(Collectors.toList());
    }

    // 평균 평점 조회
    @Transactional
    public double getItemAverageRating(int itemNo) {
        // 상품 확인
        itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        Double avgRating = reviewRepository.calculateAverageRatingByItemNo(itemNo);
        return avgRating != null ? avgRating : 0.0;
    }


    // 리뷰 상세 조회
    @Transactional
    public ReviewDetailResDto getReview(int itemNo, Long reviewNo) {
        Review review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.REVIEW_NOT_FOUND));

        return ReviewDetailResDto.toDto(review);
    }

    // 리뷰 수정
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public ReviewUpdateResDto updateReview(int itemNo, Long reviewNo, ReviewUpdateReqDto request, List<MultipartFile> files) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 기존 리뷰 조회
        Review review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.REVIEW_NOT_FOUND));

        boolean isUser = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("USER"));

        // 생성자 동일한지 확인
        if (isUser) {
            String createdUser = review.extractEmail();
            String userName = authentication.getName();
            if (!createdUser.equals(userName)) {
                throw new BobIssueException(ResponseCode.UNAUTHORIZED_REVIEW);
            }
        }

        // 이미지 저장소
        List<ReviewImage> updatedImages = new ArrayList<>();
        
        // 유지할 이미지 처리
        if (request.getKeepImageIds() != null && !request.getKeepImageIds().isEmpty()) {
            updatedImages.addAll(review.getImages().stream()
                    .filter(img -> request.getKeepImageIds().contains(img.getImageNo()))
                    .collect(Collectors.toList()));
        }

        // 삭제할 이미지 처리
        List<String> deleteUrls = review.getImages().stream()
                .filter(img -> request.getKeepImageIds() == null ||
                        !request.getKeepImageIds().contains(img.getImageNo()))
                .map(ReviewImage::getImageUrl)
                .collect(Collectors.toList());

        // 2-3. 새 이미지 업로드 및 처리
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String imageUrl = s3Service.uploadFile("review", file);
                ReviewImage reviewImage = ReviewImage.builder()
                        .review(review)
                        .originalName(file.getOriginalFilename())
                        .imageUrl(imageUrl)
                        .build();
                updatedImages.add(reviewImage);
            }
        }

        // 이미지 데이터베이스 처리
        review.getImages().clear();  // 기존 이미지 모두 제거
        review.getImages().addAll(updatedImages);

        // 리뷰 평점 유효성 검사 (1-5점)
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BobIssueException(ResponseCode.INVALID_RATING);
        }

        if (!deleteUrls.isEmpty()) {
            s3Service.deleteFiles(deleteUrls);
        }

        // 리뷰 내용 수정
        review.update(request.getContent(), request.getRating());
//        review.setUpdatedUser(request.getUpdatedUser());

        Review updatedReview = reviewRepository.save(review);
        return ReviewUpdateResDto.toDto(updatedReview);
    }

    // 리뷰 삭제
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public void deleteReview(Long reviewNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Review review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.REVIEW_NOT_FOUND));

        boolean isUser = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("USER"));

        // 생성자 동일한지 확인
        if (isUser) {
            String createdUser = review.extractEmail();
            String userName = authentication.getName();
            if (!createdUser.equals(userName)) {
                throw new BobIssueException(ResponseCode.UNAUTHORIZED_REVIEW);
            }
        }

        // 이미지 삭제
        List<String> deleteUrls = review.getImages().stream()
                .map(ReviewImage::getImageUrl)
                .collect(Collectors.toList());

        if (!deleteUrls.isEmpty()) {
            s3Service.deleteFiles(deleteUrls);
        }

        review.getImages().clear();

        review.delete();
        reviewRepository.save(review);
    }

}