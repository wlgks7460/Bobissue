package com.c108.springproject.user.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.dto.response.OrderDetailResDto;
import com.c108.springproject.order.dto.response.OrderListResDto;
import com.c108.springproject.order.repository.OrderRepository;
import com.c108.springproject.order.service.OrderService;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.dto.response.QuestionResDto;
import com.c108.springproject.question.repository.QuestionRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.domain.UserGrade;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UserUpdateReqDto;
import com.c108.springproject.user.dto.UserResDto;
import com.c108.springproject.item.repository.ItemQueryRepository;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ItemQueryRepository itemQueryRepository;
    private final OrderService orderService;
    private final QuestionRepository questionRepository;


    public UserService(UserRepository userRepository,
                       OrderRepository orderRepository,
                       ItemQueryRepository itemQueryRepository, OrderService orderService, QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.itemQueryRepository = itemQueryRepository;
        this.orderService = orderService;
        this.questionRepository = questionRepository;
    }

    @Transactional
    public int signUp(SignUpReqDto signUpDto) {
        try {
            User new_user=User.builder()
                    .name(signUpDto.getName())
                    .birthday(signUpDto.getBirthday())
                    .email(signUpDto.getEmail())
                    .password(signUpDto.getPassword())
                    .gender(signUpDto.getGender())
                    .height(signUpDto.getHeight())
                    .weight(signUpDto.getWeight())
                    .phoneNumber(signUpDto.getPhoneNumber())
                    .status("Y")
                    .amount(0)
                    .grade(UserGrade.BRONZE)
                    .build();

            userRepository.save(new_user);
            return new_user.getUserNo();
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_SIGNUP_USER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public UserResDto userProfile(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailAndDelYnAndStatus(email,"N" ,"Y").orElseThrow(
                () -> new BobIssueException(ResponseCode.USER_NOT_FOUND)
        );
        return UserResDto.toDto(user);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<UserResDto> findUserList() {
        try {
            return userRepository.findByDelYn("N").stream()
                    .map(UserResDto::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.SUCCESS_FOUND_USER_LIST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public UserResDto findUserById(int userNo) {
        try {
            return userRepository.findById(userNo)
                    .filter(user -> !"Y".equals(user.getDelYn())) // 삭제된 회원은 조회되지 않도록 필터링
                    .map(UserResDto::new)
                    .orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_USER));
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.NOT_FOUND_USER);
        }

    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public UserResDto updateUser(int userNo, UserUpdateReqDto userDto) {
        try{
            User user = userRepository.findById(userNo).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_USER));
            user.updateUser(userDto);
            return UserResDto.toDto(user);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_USER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public void deleteUser(int userNo) {
        User user = userRepository.findById(userNo).orElseThrow(() ->
                new BobIssueException(ResponseCode.NOT_FOUND_USER));

        user.delete();

    }

    @Transactional
    public User findByEmail(String email) {
        return userRepository.findByEmailAndDelYnAndStatus(email,"N", "Y").orElseThrow(()-> new BobIssueException(ResponseCode.FAILED_FIND_EMAIL));
    }

    @Scheduled(cron = "0 0 0 1 * ?")
    public void updateUserGrades() {
        System.out.println("매월 1일 사용자 등급 업데이트 완료");
        try{
            YearMonth lastMonth = YearMonth.now().minusMonths(1);
            LocalDateTime startDate = lastMonth.atDay(1).atStartOfDay();              // 지난달 1일 00:00:00
            LocalDateTime endDate = lastMonth.atEndOfMonth().atTime(23, 59, 59);     // 지난달 마지막 날 23:59:59

            // 모든 사용자 가져오기
            List<User> users = userRepository.findAll();

            for (User user : users) {
                // 해당 사용자의 지난달 확정 주문 금액 가져오기
                Integer totalPrice = orderRepository.getTotalPriceByUserForMonth(user.getUserNo(), startDate, endDate);
                int amount = totalPrice != null ? totalPrice : 0;

                // 사용자 등급 업데이트
                user.updateGrade(amount);
                userRepository.save(user);
            }
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_GRADE);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public List<OrderListResDto> getUserOrderList(int userNo) {
        try {
            List<Order> orders = orderRepository.findByUser_UserNo(userNo);
            List<OrderListResDto> orderListResDtos = new ArrayList<>();
            for(Order order: orders) {
                orderListResDtos.add(OrderListResDto.toDto(order));
            }
            return orderListResDtos;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_USER_ORDER_LIST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public OrderDetailResDto getUserOrderDetail(Long orderNo) {
        try {
            Order order = orderRepository.findById(orderNo)
                    .orElseThrow(() -> new BobIssueException(ResponseCode.ORDER_NOT_FOUND));
            return OrderDetailResDto.toDto(order);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_USER_ORDER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public List<QuestionResDto> getUserQuestions(int userNo) {
        try {
            List<Question> questions = questionRepository.findByUser_UserNo(userNo);
            List<QuestionResDto> questionResDtos = new ArrayList<>();
            for(Question question : questions) {
                questionResDtos.add(QuestionResDto.toDto(question));
            }
            return questionResDtos;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_ALL_QUESTION);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public QuestionResDto getUserQuestionDetail(int userNo, Long questionNo) {
        Question question = questionRepository.findByUser_UserNoAndQuestionNo(userNo, questionNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.QUESTION_NOT_FOUND));
        question.readQuestion();
        return QuestionResDto.toDto(question);
    }


}
