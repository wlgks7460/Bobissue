package com.c108.springproject.user.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.jwt.JwtTokenProvider;
import com.c108.springproject.global.jwt.RefreshToken.RefreshToken;
import com.c108.springproject.global.jwt.RefreshToken.RefreshTokenRepository;
import com.c108.springproject.global.redis.RedisService;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.auths.dto.request.LoginReqDto;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UserDto;
import com.c108.springproject.user.dto.UserResDto;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;


    public UserService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtTokenProvider jwtTokenProvider,
                       RedisService redisService
                       ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisService = redisService;
    }

    @Transactional
    public User signUp(SignUpReqDto signUpDto) {
        User new_user=User.builder()
                .name(signUpDto.getName())
                .birthday(signUpDto.getBirthday())
                .email(signUpDto.getEmail())
                .password(signUpDto.getPassword())
                .gender(signUpDto.getGender())
                .height(signUpDto.getHeight())
                .weight(signUpDto.getWeight())
                .loginType(signUpDto.getLoginType())
                .phoneNumber(signUpDto.getPhoneNumber())
                .status("Y")
                .build();

        return userRepository.save(new_user);
    }

    @Transactional
    public List<UserResDto> findUserList() {

        return userRepository.findAllActiveUsers().stream()
                .map(UserResDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResDto findUserById(int userNo) {
        return userRepository.findById(userNo)
                .filter(user -> !"Y".equals(user.getDelYn())) // 삭제된 회원은 조회되지 않도록 필터링
                .map(UserResDto::new)
                .orElse(null);
    }

    @Transactional
    public void updateUser(int userNo, UserDto userDto) {
        try{
            User user = userRepository.findById(userNo).orElse(null);
            user.updateUser(userDto);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_USER);
        }

    }

    @Transactional
    public void deleteUser(int userNo) {
        User user = userRepository.findById(userNo).orElseThrow(() ->
                new BobIssueException(ResponseCode.FAILED_DELETE_USER));

        user.delete();
    }


}
