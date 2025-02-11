package com.c108.springproject.calendar.service;

import com.c108.springproject.calendar.domain.Calendar;
import com.c108.springproject.calendar.dto.MealReqDto;
import com.c108.springproject.calendar.dto.MealResDto;
import com.c108.springproject.calendar.repository.CalendarRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final UserRepository userRepository;

    public CalendarService(CalendarRepository calendarRepository, UserRepository userRepository) {
        this.calendarRepository = calendarRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Map<String, Integer> findAllMealByMonth(int userNo, int year, int month) {
        String yearMonth = String.format("%04d%02d", year, month);

        // 해당 월의 식단 데이터 조회
        List<Calendar> meals = calendarRepository.findMealsByMonth(userNo, yearMonth);

        // 'yyyyMMdd' 기준으로 그룹화하고 칼로리 합산
        Map<String, Integer> calorieMap = meals.stream()
                .collect(Collectors.groupingBy(
                        meal -> meal.getEatDate().substring(0, 8),    // 날짜 부분만 추출
                        Collectors.summingInt(Calendar::getCalorie)
                ));

        // 해당 월의 모든 날짜에 대해 칼로리 데이터 채우기 (데이터가 없는 날은 0 kCal)
        int daysInMonth = YearMonth.of(year, month).lengthOfMonth();
        for (int day = 1; day <= daysInMonth; day++) {
            String dateKey = String.format("%04d%02d%02d", year, month, day);  // yyyyMMdd 형식
            calorieMap.putIfAbsent(dateKey, 0);
        }

        return calorieMap;
    }

    @Transactional
    public MealResDto createMeal(int userNo, String eatDate, MealReqDto mealReqDto) {
        eatDate = eatDate+" "+mealReqDto.getEatTime();
        Calendar calendar = Calendar.builder()
                .userNo(userNo)
                .name(mealReqDto.getName())
                .eatDate(eatDate)
                .calorie(mealReqDto.getCalorie())
                .build();

        calendarRepository.save(calendar);

        return MealResDto.toDto(calendar);
    }

    @Transactional
    public List<MealResDto> findAllMealByDay(int userNo, String eatDate) {
        List<Calendar> meals = calendarRepository.findMealsByDay(userNo, eatDate);

        return meals.stream()
                .map(meal -> MealResDto.builder()
                        .name(meal.getName())
                        .eatTime(meal.getEatDate())
                        .calorie(meal.getCalorie())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public MealResDto updateMeal(long calendarNo,MealReqDto mealReqDto){
        Calendar meal = calendarRepository.findById((int) calendarNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_CALENDAL));

        meal= Calendar.builder()
                .name(mealReqDto.getName())                // 새로운 이름으로 업데이트
                .eatDate(meal.getEatDate()+" "+mealReqDto.getEatTime())        // 기존 eatDate 유지
                .calorie(mealReqDto.getCalorie())          // 새로운 칼로리로 업데이트
                .build();

        return MealResDto.toDto(meal);
    }

    @Transactional
    public MealResDto deleteMeal(long calendarNo) {
        Calendar meal = calendarRepository.findById((int) calendarNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_CALENDAL));

        try {
            meal.setDelYn("Y");
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_DELETE_CALENDAR);
        }

        return MealResDto.toDto(meal);
    }


}
