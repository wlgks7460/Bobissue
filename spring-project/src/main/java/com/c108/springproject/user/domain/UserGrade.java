package com.c108.springproject.user.domain;

import lombok.Getter;

@Getter
public enum UserGrade {
    BRONZE,
    SILVER,
    GOLD;

    public static UserGrade getGradeByAmount(int amount) {
        if (amount >= 300000) {
            return GOLD;
        } else if (amount >= 100000) {
            return SILVER;
        } else {
            return BRONZE;
        }

    }

}
