package com.c108.springproject.user.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.jwt.JwtTokenProvider;
import com.c108.springproject.global.jwt.RefreshToken.RefreshToken;
import com.c108.springproject.global.jwt.RefreshToken.RefreshTokenRepository;
import com.c108.springproject.global.redis.RedisService;
import com.c108.springproject.order.repository.OrderRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.auths.dto.request.LoginReqDto;
import com.c108.springproject.user.domain.UserGrade;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UserDto;
import com.c108.springproject.user.dto.UserResDto;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;


    public UserService(UserRepository userRepository,
                       OrderRepository orderRepository
                       ) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
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
    public UserResDto updateUser(int userNo, UserDto userDto) {
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
        try{
            user.delete();
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_DELETE_USER);
        }
    }

    @Transactional
    public User findByEmail(String email) {
        return userRepository.findByEmailAndDelYnAndStatus(email,"N", "Y").orElseThrow(()-> new BobIssueException(ResponseCode.FAILED_FIND_EMAIL));
    }

    @Scheduled(cron = "0 0 0 1 * ?")
    public void updateUserGrades() {
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
    }

}
