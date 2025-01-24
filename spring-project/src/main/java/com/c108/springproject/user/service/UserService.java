package com.c108.springproject.user.service;

import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UsersResDto;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                .createdAt(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .updatedAt(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .build();

        return userRepository.save(new_user);
    }

    @Transactional
    public List<UsersResDto> findUserList() {

        return userRepository.findAll().stream()
                .map(UsersResDto::new)
                .collect(Collectors.toList());
    }

//    @Transactional
//    public User signIn(String email, String password) {
//    }


}
