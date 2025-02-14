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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
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
//    @Transactional
//    public EventBannerResDto getBanner() {
//        return
//    }

    // 이벤트 상세 조회
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
                    .name(reqDto.getName())
                    .title(reqDto.getTitle())
                    .description(reqDto.getDescription())
                    .build();

            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imageUrl = s3Service.uploadFile("calender", file);

                    EventImage mealImage = EventImage.builder()
                            .event(event)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imageUrl)
                            .build();

                    event.getImages().add(mealImage);
                }
            }
            eventRepository.save(event);
            return EventDetailResDto.toDto(event);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_EVENT);
        }
    }

    //이벤트 수정
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public EventDetailResDto updateEvent(int eventNo, EventReqDto reqDto, List<MultipartFile> files) {
        Event event = eventRepository.findById(eventNo).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_EVENT));
        try{
            event.builder()
                    .name(reqDto.getName())
                    .title(reqDto.getTitle())
                    .description(reqDto.getDescription())
                    .startDate(reqDto.getStartDate())
                    .endDate(reqDto.getEndDate())
                    .build();

            List<EventImage> updatedImages = new ArrayList<>();

            // 유지할 이미지 처리
            if (reqDto.getKeepImageNos() != null && !reqDto.getKeepImageNos().isEmpty()) {
                updatedImages.addAll(event.getImages().stream()
                        .filter(img -> reqDto.getKeepImageNos().contains(img.getImageNo()))
                        .collect(Collectors.toList()));
            }

            // 삭제할 이미지 처리
            List<String> deleteUrls = event.getImages().stream()
                    .filter(img -> reqDto.getKeepImageNos() == null ||
                            !reqDto.getKeepImageNos().contains(img.getImageNo()))
                    .map(EventImage::getImageUrl)
                    .collect(Collectors.toList());

            if (!deleteUrls.isEmpty()) {
                s3Service.deleteFiles(deleteUrls);
            }

            // 2-3. 새 이미지 업로드 및 처리
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

            Event updatedEvent = Event.builder()
                    .eventNo(eventNo)
                    .name(event.getName())
                    .title(event.getTitle())
                    .description(event.getDescription())
                    .startDate(event.getStartDate())
                    .endDate(event.getEndDate())
                    .status(event.getStatus())
                    .build();

            updatedEvent.setCreatedUser(event.getCreatedUser());
            updatedEvent.setCreatedAt(event.getCreatedAt());
            String currentDate = new SimpleDateFormat("yyyyMMdd HHmmss").format(new Date());
            updatedEvent.setUpdatedAt(currentDate);

            Event savedEvent = eventRepository.save(updatedEvent);
            return EventDetailResDto.toDto(savedEvent);
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

}
