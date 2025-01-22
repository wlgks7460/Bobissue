package com.c108.springproject.user.service;

import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.dto.SignUpDto;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User signUp(SignUpDto signUpDto) {
//        String encodedPassword = passwordEncoder.encode(signUpDto.getPassword());

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
                .createdAt("2025-01-22")
                .updatedAt("2025-01-22")
                .build();

        return userRepository.save(new_user);
    }
}
