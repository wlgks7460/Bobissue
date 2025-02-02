package com.c108.springproject.user.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.global.jwt.JwtTokenProvider;
import com.c108.springproject.global.jwt.RefreshToken.RefreshToken;
import com.c108.springproject.global.jwt.RefreshToken.RefreshTokenRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.dto.LoginReqDto;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UserDto;
import com.c108.springproject.user.dto.UserResDto;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;


    public UserService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtTokenProvider jwtTokenProvider
                       ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
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


    @Transactional
    public Map<String, String> doLogin(LoginReqDto loginReqDto){
        try{
            User user = userRepository.findByEmail(loginReqDto.getEmail()).orElseThrow(()-> new BobIssueException(ResponseCode.USER_NOT_FOUND));

            if(!loginReqDto.getPassword().equals(user.getPassword())){
                throw new BobIssueException(ResponseCode.FAIL_PASSWORD_CHECK);
            }

            String accessToken = jwtTokenProvider.createAccessToken(String.format("%s:%s", user.getEmail(), "USER"));
            String refreshToken = jwtTokenProvider.createRefreshToken("USER", user.getUserNo());

            System.out.println("로그인");
            System.out.println(accessToken);
            System.out.println(refreshToken);

            refreshTokenRepository.findByUserEmail(user.getEmail())
                    .ifPresentOrElse(
                            it -> it.updateRefreshToken(refreshToken),
                            () -> refreshTokenRepository.save(new RefreshToken(user, refreshToken))
                    );

            Map<String, String> result = new HashMap<>();

            result.put("access_token", accessToken);
            result.put("refresh_token", refreshToken);

            return result;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_LOGIN);
        }
    }


}
