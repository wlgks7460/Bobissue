package com.c108.springproject.global;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class BobIssueException extends RuntimeException {

    Object data;

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }

    public BobIssueException() {
        super();
    }

    public BobIssueException(String message, Throwable cause) {
        super(message, cause);
    }

    public BobIssueException(String message, ResponseCode responseCode) {
        super(message);
        this.data = responseCode;
    }

    public BobIssueException(ResponseCode responseCode){
        super(responseCode.getLabel());
        this.data = responseCode;
    }

    public BobIssueException(ResponseCode responseCode, Object data){
        super(responseCode.getLabel());
        this.data = data;
    }

}
