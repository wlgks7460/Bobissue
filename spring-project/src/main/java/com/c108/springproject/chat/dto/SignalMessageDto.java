package com.c108.springproject.chat.dto;

public class SignalMessageDto {
    private String type; // "offer", "answer", "ice-candidate"
    private String sdp; // SDP 메시지
    private String candidate; // ICE Candidate 메시지

    public SignalMessageDto() {}

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSdp() {
        return sdp;
    }

    public void setSdp(String sdp) {
        this.sdp = sdp;
    }

    public String getCandidate() {
        return candidate;
    }

    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }
}
