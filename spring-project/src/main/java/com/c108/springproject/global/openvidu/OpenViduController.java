package com.c108.springproject.global.openvidu;

import io.openvidu.java.client.*;
import io.openvidu.java.client.SessionProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/openvidu")
public class OpenViduController {

    private static final String OPENVIDU_URL = "https://bobissue.store:8443";
    private static final String OPENVIDU_USERNAME = "OPENVIDUAPP";
    private static final String OPENVIDU_SECRET = "C108bob";


    private OpenVidu openVidu;

    @PostConstruct
    public void init() {
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @PostMapping("/sessions")
    public ResponseEntity<String> initializeSession(
            @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("들어옴");
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openVidu.createSession(properties);
        System.out.println("받아서 나감");
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }



@PostMapping("/sessions/{sessionId}/connections")
public ResponseEntity<String> createConnection(
        @PathVariable("sessionId") String sessionId, @RequestBody Map<String, Object> params)
        throws OpenViduJavaClientException, OpenViduHttpException {
    System.out.println(":::들어옴");
    Session session = openVidu.getActiveSession(sessionId);
    if (session == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
    Connection connection = session.createConnection(properties);
    System.out.println(":::나감요");
    return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
}
}