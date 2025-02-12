package com.c108.springproject.calendar.controller;

import com.c108.springproject.calendar.dto.MealReqDto;
import com.c108.springproject.calendar.dto.MealResDto;
import com.c108.springproject.calendar.service.CalendarService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final UserService userService;

    @Autowired
    public CalendarController(CalendarService calendarService, UserService userService) {
        this.calendarService = calendarService;
        this.userService = userService;
    }

    // 한달치 식단 칼로리 조회
    @GetMapping("/{year}/{month}")
    public ResponseDto findAllMealByMonth(@PathVariable int year, @PathVariable int month) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        int userNo = userService.findByEmail(email).getUserNo();

        Map<String, Integer> calorieData = calendarService.findAllMealByMonth(userNo, year, month);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CALENDAR, new DefaultResponse<Map<String, Integer>>(calorieData));
    }

    // 한끼 등록
    @PostMapping("/{year}/{month}/{day}")
    public ResponseDto createMeal(@PathVariable int year, @PathVariable int month, @PathVariable int day, @RequestBody MealReqDto mealReqDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        int userNo = userService.findByEmail(email).getUserNo();

        String eatDate = String.format("%04d%02d%02d", year, month, day);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_CREATE_CALENDAR, new DefaultResponse<MealResDto>(calendarService.createMeal(userNo, eatDate, mealReqDto)));
    }

    // 하루 끼니 조회
    @GetMapping("/{year}/{month}/{day}")
    public ResponseDto findAllMealByDay(@PathVariable int year, @PathVariable int month, @PathVariable int day) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        int userNo = userService.findByEmail(email).getUserNo();

        String eatDate = String.format("%04d%02d%02d", year, month, day);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CALENDAR, new DefaultResponse<List<MealResDto>>(calendarService.findAllMealByDay(userNo, eatDate)));
    }

    // 한끼 수정
    @PutMapping("/{calendarNo}")
    public ResponseDto updateMeal(@PathVariable long calendarNo, @RequestBody MealReqDto mealReqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_CALENDAR, new DefaultResponse<MealResDto>(calendarService.updateMeal(calendarNo, mealReqDto)));
    }

    // 한끼 삭제
    @DeleteMapping("/{calendarNo}")
    public ResponseDto deleteMeal(@PathVariable long calendarNo){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_CALENDAR, new DefaultResponse<MealResDto>(calendarService.deleteMeal(calendarNo)));
    }
}
