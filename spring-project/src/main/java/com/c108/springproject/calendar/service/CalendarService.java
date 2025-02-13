package com.c108.springproject.calendar.service;

import com.c108.springproject.calendar.domain.Calendar;
import com.c108.springproject.calendar.domain.MealImage;
import com.c108.springproject.calendar.dto.MealReqDto;
import com.c108.springproject.calendar.dto.MealResDto;
import com.c108.springproject.calendar.repository.CalendarRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    public CalendarService(CalendarRepository calendarRepository, UserRepository userRepository, S3Service s3Service) {
        this.calendarRepository = calendarRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public Map<String, Integer> findAllMealByMonth(int userNo, int year, int month) {
        String yearMonth = String.format("%04d%02d", year, month);

        try{
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
        }catch(Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_CALENDAR);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public MealResDto createMeal(int userNo, String eatDate, MealReqDto mealReqDto, List<MultipartFile> files) {
        User user = userRepository.findById(userNo).orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_USER));
        try{
            eatDate = eatDate+" "+mealReqDto.getEatTime();
            Calendar calendar = Calendar.builder()
                    .user(user)
                    .name(mealReqDto.getName())
                    .eatDate(eatDate)
                    .calorie(mealReqDto.getCalorie())
                    .build();

            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imageUrl = s3Service.uploadFile("calender", file);

                    MealImage mealImage = MealImage.builder()
                            .calendar(calendar)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imageUrl)
                            .build();

                    calendar.getImages().add(mealImage);
                }
            }

            calendarRepository.save(calendar);

            return MealResDto.toDto(calendar);
        }catch(Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_CALENDAR);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<MealResDto> findAllMealByDay(int userNo, String eatDate) {
        try {
            List<Calendar> meals = calendarRepository.findMealsByDay(userNo, eatDate);

            return meals.stream()
                    .map(MealResDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_CALENDAR);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public MealResDto updateMeal(long calendarNo,MealReqDto mealReqDto, List<MultipartFile> files){
        Calendar meal = calendarRepository.findByCalendarNo(calendarNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_CALENDAL));
        try {
            meal.update(
                    mealReqDto.getName(),
                    meal.getEatDate() + " " + mealReqDto.getEatTime(),
                    mealReqDto.getCalorie()
            );

            // 이미지 처리 이미지 어차피 하나만 받을 거니까 다 삭제
            // 이미지 삭제
            List<String> deleteUrls = meal.getImages().stream()
                    .map(MealImage::getImageUrl)
                    .collect(Collectors.toList());
            if (!deleteUrls.isEmpty()) {
                s3Service.deleteFiles(deleteUrls);
            }
            meal.getImages().clear(); // DB 이미지 삭제

            // 이미지 업데이트
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imageUrl = s3Service.uploadFile("calender", file);

                    MealImage mealImage = MealImage.builder()
                            .calendar(meal)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imageUrl)
                            .build();

                    meal.getImages().add(mealImage);
                }
            }
            Calendar savedMeal = calendarRepository.save(meal);
            return MealResDto.toDto(savedMeal);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_CALENDAR);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public MealResDto deleteMeal(long calendarNo) {
        Calendar meal = calendarRepository.findByCalendarNo(calendarNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_CALENDAL));
        try {
            meal.setDelYn("Y");

            // 이미지도 함께 삭제
            List<String> deleteUrls = meal.getImages().stream()
                    .map(MealImage::getImageUrl)
                    .collect(Collectors.toList());
            if (!deleteUrls.isEmpty()) {
                s3Service.deleteFiles(deleteUrls);
            }
            meal.getImages().clear(); // DB 이미지 삭제

            return MealResDto.toDto(meal);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_DELETE_CALENDAR);
        }
    }


}
