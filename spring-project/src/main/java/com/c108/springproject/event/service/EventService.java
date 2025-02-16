package com.c108.springproject.event.service;

import com.c108.springproject.calendar.domain.MealImage;
import com.c108.springproject.event.domain.Event;
import com.c108.springproject.event.domain.EventImage;
import com.c108.springproject.event.dto.response.EventDetailResDto;
import com.c108.springproject.event.dto.response.EventBannerResDto;
import com.c108.springproject.event.dto.request.EventReqDto;
import com.c108.springproject.event.repository.EventRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final S3Service s3Service;

    public EventService(EventRepository eventRepository, S3Service s3Service) {
        this.eventRepository = eventRepository;
        this.s3Service = s3Service;
    }

    // 이벤트 배너 조회
    @Transactional
    public List<EventBannerResDto> getBanner() {
        List<Event> events = eventRepository.findByStatusAndDelYn("Y", "N");  // 활성 이벤트 조회

        return events.stream()
                .map(EventBannerResDto::toDto)
                .collect(Collectors.toList());
    }

    // 이벤트 조회
    @Transactional
    public EventDetailResDto getEventDetail(int eventNo) {
        Event event =eventRepository.findById(eventNo).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_EVENT));
        return EventDetailResDto.toDto(event);
    }

    // 이벤트 작성
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public EventDetailResDto createEvent(EventReqDto reqDto, List<MultipartFile> files) {
        try{
            Event event = Event.builder()
                    .title(reqDto.getTitle())
                    .description(reqDto.getDescription())
                    .startDate(reqDto.getStartDate())
                    .endDate(reqDto.getEndDate())
                    .images(new ArrayList<>())
                    .status("N")
                    .build();

            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imageUrl = s3Service.uploadFile("event", file);

                    EventImage eventImage = EventImage.builder()
                            .event(event)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imageUrl)
                            .build();

                    event.getImages().add(eventImage);
                }
            }

            return EventDetailResDto.toDto(eventRepository.save(event));
        } catch (Exception e) {
            System.out.println("service에서 이벤트 생성 오류");
            throw new BobIssueException(ResponseCode.FAILED_CREATE_EVENT);
        }
    }

    //이벤트 수정
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public EventDetailResDto updateEvent(int eventNo, EventReqDto reqDto, List<MultipartFile> files, List<Integer> keepImageNos) {
        Event event = eventRepository.findById(eventNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_EVENT));
        try {
            // 1. 유지할 이미지 처리
            List<EventImage> updatedImages = event.getImages().stream()
                    .filter(img -> keepImageNos != null && keepImageNos.contains((int) img.getImageNo()))
                    .collect(Collectors.toList());

            // 2. 삭제할 이미지 delYn="Y" 처리
            event.getImages().stream()
                    .filter(img -> keepImageNos == null || !keepImageNos.contains((int) img.getImageNo()))
                    .forEach(img -> img.setDelYn("Y"));

            // 3. 새 이미지 추가
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imageUrl = s3Service.uploadFile("event", file);
                    EventImage eventImage = EventImage.builder()
                            .event(event)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imageUrl)
                            .build();
                    updatedImages.add(eventImage);
                }
            }

            // 4. 이벤트 정보 업데이트
            event.setTitle(reqDto.getTitle());
            event.setDescription(reqDto.getDescription());
            event.setStartDate(reqDto.getStartDate());
            event.setEndDate(reqDto.getEndDate());

            event.getImages().clear();
            event.getImages().addAll(updatedImages);

            return EventDetailResDto.toDto(event);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_EVENT);
        }
    }



    // 이벤트 삭제
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public int deleteEvent(int eventNo) {
        Event event = eventRepository.findById(eventNo).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_EVENT));
        try{
            event.delete();
            List<String> deleteUrls = event.getImages().stream()
                    .map(EventImage::getImageUrl)
                    .collect(Collectors.toList());
            if (!deleteUrls.isEmpty()) {
                s3Service.deleteFiles(deleteUrls);
            }
            event.getImages().clear();
            return eventNo;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_DELETE_EVENT);
        }
    }

    // 날짜별 이벤트 활성화 처리
    @Scheduled(cron = "0 0 0 * * ?")  // 매일 자정
    @Transactional
    public void updateEventStatus() {
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd HHmmss"));
        List<Event> allEvents = eventRepository.findAll();

        for (Event event : allEvents) {
            String status = (currentDate.compareTo(event.getStartDate()) >= 0 && currentDate.compareTo(event.getEndDate()) <= 0)
                    ? "Y" : "N";
            event.setStatus(status);
        }
    }


}
