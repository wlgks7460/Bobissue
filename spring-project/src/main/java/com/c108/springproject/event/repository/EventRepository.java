package com.c108.springproject.event.repository;

import com.c108.springproject.event.domain.Event;
import com.c108.springproject.event.dto.response.EventBannerResDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByStatusAndDelYn(String status,String delYn);

}
