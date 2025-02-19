package com.c108.springproject.chat.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class NickNameService {
    private static final List<String> ADJECTIVES = List.of(
            "운동하는", "똑똑한", "귀여운", "용감한", "신나는", "재밌는", "차분한", "빠른", "강한", "행복한"
    );

    private static final List<String> NOUNS = List.of(
            "포르도", "늑대", "고양이", "사자", "펭귄", "코끼리", "호랑이", "독수리", "토끼", "거북이"
    );

    private static final Random RANDOM = new Random();

    public String generateRandomNickname() {
        String adjective = ADJECTIVES.get(RANDOM.nextInt(ADJECTIVES.size()));
        String noun = NOUNS.get(RANDOM.nextInt(NOUNS.size()));
        int number = RANDOM.nextInt(1000); // 0~999 랜덤 숫자

        return adjective + " " + noun + number;
    }
}