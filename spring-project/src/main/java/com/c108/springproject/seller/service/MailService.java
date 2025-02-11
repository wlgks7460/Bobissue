package com.c108.springproject.seller.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.dto.EmailReqDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;

    public void sendMail(String email, EmailReqDto emailReqDto) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(emailReqDto.getRecipient()); // 메일 수신자
            String subject = email + "님께서 발송 : " + emailReqDto.getTitle();
            mimeMessageHelper.setSubject(subject); // 메일 제목
            mimeMessageHelper.setText(emailReqDto.getContent()); // 메일 본문 내용, HTML 여부
            javaMailSender.send(mimeMessage);
            System.out.println("이메일 전송");
        } catch (Exception | Error e) {
            throw new BobIssueException(ResponseCode.FAILED_SEND_EMAIL);
        }
    }
}
