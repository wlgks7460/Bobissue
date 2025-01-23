package com.c108.springproject.global;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler({BobIssueException.class})
    @Order(value = Ordered.HIGHEST_PRECEDENCE)
    public ResponseEntity<?> handlerBobIssueException(BobIssueException e) {
        return new ResponseEntity<>(DefaultResponse.ErrorResponse.builder().error(e.getData()).build(), HttpStatus.CONFLICT);
    }
}
