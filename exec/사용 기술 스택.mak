# 사용 기술 스택

## spring-project
- **Liberica JDK 17**

 ```yaml
server:
  port: 8080

spring:
  application:
    name: spring-project

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 50MB

  profiles:
    include: aws

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://i12c108.p.ssafy.io:3306/test
    username: ssafy
    password: C108bob!!

  jpa:
    database: mysql
    database-platform: org.hibernate.dialect.MySQL8Dialect
    generate-ddl: true
    hibernate:
      ddl-auto: update
    show-sql: true

  data:
    redis:
      host: 43.202.60.173
      port: 6379
    mongodb:
      host: 43.202.60.173
      port: 27017
      username: bobissue
      password: C108bob!!
      authentication-database: admin  # 인증을 사용할 경우 추가
      database: bobChat



  elasticsearch:
    uris: http://bobissue.store:9200
    username: elastic
    password: "ok=Z+-QeSD9vAvWvY8KV"


  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: 8f481a81b837b3c5bd608b855e404e32
            client-secret: ig7qbRV0aeZzNxKWpMeR3SV7lhv4iYsA
            client-name: Kakao
            client-authentication-method: client_secret_post
            authorization-grant-type: authorization_code
            redirect-uri: http://bobissue.duckdns.org:8082/login/oauth2/code/kakao
            scope: profile_nickname, account_email


        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id

  mail:
    host: smtp.gmail.com
    port: 587
    username: ssaminute@gmail.com
    password: caqq iywv mhqo yymc
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

  task:
    scheduling:
      enabled: true

jwt:
  secretKey: MzY4IHN1cGVyIHNlY3JldCBrZXkgdGhhdCBpcyBhd2Vzb21l...
  access:
    expiration: 6000
  refresh:
    expiration-hours: 24
  issuer: BobIssue


system:
  properties:
    javax.net.ssl.trustStore: "/etc/ssl/certs/java/cacerts"
    javax.net.ssl.trustStorePassword: "changeit"


## React 프로젝트
- `.env` 파일
  # 서버 api url
  VITE_BOBISUUE_BASE_URL=https://bobissue.store

  # 결제 api key
  VITE_PORTONE_STORE_ID=imp01087767
{
  "name": "react-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "start": "vite --host",
    "dev": "vite --host",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@faker-js/faker": "^9.5.0",
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@heroicons/react": "^2.2.0",
    "@mui/icons-material": "^6.4.4",
    "@mui/material": "^6.4.4",
    "@radix-ui/react-icons": "^1.3.2",
    "@redux-devtools/extension": "^3.3.0",
    "@reduxjs/toolkit": "^2.5.0",
    "@stomp/stompjs": "^7.0.0",
    "axios": "^1.7.9",
    "chart.js": "^4.4.7",
    "class-variance-authority": "^0.7.1",
    "dayjs": "^1.11.13",
    "emailjs-com": "^3.2.0",
    "exceljs": "^4.4.0",
    "http-proxy-middleware": "^3.0.3",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.474.0",
    "moment": "^2.30.1",
    "moment-timezone": "^0.5.46",
    "openvidu-browser": "^2.31.0",
    "puppeteer": "^24.2.1",
    "react": "^18.3.1",
    "react-big-calendar": "^1.17.1",
    "react-chartjs-2": "^5.3.0",
    "react-countup": "^6.5.3",
    "react-datepicker": "^8.0.0",
    "react-daum-postcode": "^3.2.0",
    "react-dom": "^18.3.1",
    "react-draggable": "^4.4.6",
    "react-icons": "^5.4.0",
    "react-intersection-observer": "^9.15.1",
    "react-items-carousel": "^2.8.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.1.3",
    "react-scripts": "^5.0.1",
    "react-slick": "^0.30.3",
    "react-spinners": "^0.15.0",
    "recharts": "^2.15.1",
    "slick-carousel": "^1.8.1",
    "sockjs-client": "^1.5.1",
    "stompjs": "^2.3.3",
    "tailwind-scrollbar-hide": "^2.0.0",
    "tailwind-variants": "^0.3.1",
    "uuid": "^11.0.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.18.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-prettier": "^10.0.1",
    "eslint-import-resolver-node": "^0.3.9",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-prettier": "^5.2.3",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "eslint-plugin-tailwindcss": "^3.18.0",
    "globals": "^15.14.0",
    "postcss": "^8.5.1",
    "prettier": "^3.4.2",
    "prettier-plugin-tailwindcss": "^0.6.10",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.5"
  }
}


## Jenkins Pipeline 설정
```groovy
pipeline {
    environment {
        repository = "jihank/bobissue"
        frontend_repository = "jihank/bobissue-frontend"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        APP_PORT = "8082"
        FRONT_PORT = "5173"
    }

    agent any
    stages {
        stage('Git Clone') {
            steps {
                git branch: 'develop', credentialsId: 'bob', url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C108'
            }
        }
        
        stage('React env') {
            steps {
                withCredentials([string(credentialsId: 'REACT_BASE_URL', variable: 'REACT_ENV')]) {
                    sh '''
                    echo "$REACT_ENV" > react-project/.env
                    cat react-project/.env

                    echo ".env 파일 생성 후 내용 확인:"
                    ls -la react-project/.env
                    cat react-project/.env  # 파일 내용을 출력
                    '''
                }
            }
        }

        stage('Compile Backend') {
            steps {
                dir('spring-project') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean bootJar'
                }
            }
        }
        
        stage('Build Backend Image') {
            steps {
                dir('spring-project') {
                    sh 'docker build -t $repository:latest .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('react-project') {
                    sh 'docker run --rm -v $PWD:/app -w /app node:20 npm install'
                    sh 'docker run --rm -v $PWD:/app -w /app node:20 npm run build'
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                dir('react-project') {
                    sh 'docker build -t $frontend_repository:latest .'
                }
            }
        }
        
        stage('Images Push') {
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $repository:latest'
                    sh 'docker push $frontend_repository:latest'
                }
            }
        }
    }
}


## Nginx 설정
certbob 다운 및 bobissue로 발급 필요

```
server {
    listen 80;
    server_name bobissue.store www.bobissue.store;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name bobissue.store www.bobissue.store;
    
    ssl_certificate /etc/letsencrypt/live/bobissue.store/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/bobissue.store/privkey.pem; # managed by Certbot
    ssl_trusted_certificate /etc/letsencrypt/live/bobissue.store/fullchain.pem; # 인증서 체인 경로 추가

    # SSL 최적화 설정
    include /etc/letsencrypt/options-ssl-nginx.conf; # SSL 관련 최적화
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # DH 파라미터 설정

    # 파일 업로드 크기 제한 (50MB)
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws/ {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header Origin "";
        proxy_set_header Access-Control-Allow-Origin "*";
    }

    location /openvidu {
        proxy_pass https://localhost:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 지원 설정
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        proxy_set_header Origin "";
        proxy_set_header Access-Control-Allow-Origin "*";
    }
}

server {
    if ($host = bobissue.duckdns.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = i12c108.p.ssafy.io) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    listen [::]:80;
    server_name i12c108.p.ssafy.io bobissue.duckdns.org;
    return 404; # managed by Certbot
}

## openvidu 설정
``` .env

# OpenVidu configuration
# ----------------------
# Documentation: https://docs.openvidu.io/en/stable/reference-docs/openvidu-config/

# NOTE: This file doesn't need to quote assignment values, like most shells do.
# All values are stored as-is, even if they contain spaces, so don't quote them.

# Domain name. If you do not have one, the public IP of the machine.
# For example: 198.51.100.1, or openvidu.example.com
DOMAIN_OR_PUBLIC_IP=bobissue.store
# OpenVidu SECRET used for apps to connect to OpenVidu server and users to access to OpenVidu Dashboard
OPENVIDU_SECRET=C108bob
# Certificate type:
# - selfsigned:  Self signed certificate. Not recommended for production use.
#                Users will see an ERROR when connected to web page.
# - owncert:     Valid certificate purchased in a Internet services company.
#                Please put the certificates files inside folder ./owncert
#                with names certificate.key and certificate.cert
# - letsencrypt: Generate a new certificate using letsencrypt. Please set the
#                required contact email for Let's Encrypt in LETSENCRYPT_EMAIL
#                variable.
CERTIFICATE_TYPE=owncert
OWNCERT_CRT=/etc/letsencrypt/live/bobissue.store/fullchain.pem
OWNCERT_KEY=/etc/letsencrypt/live/bobissue.store/privkey.pem
# If CERTIFICATE_TYPE=letsencrypt, you need to configure a valid email for notifications
LETSENCRYPT_EMAIL=wlgks746023@gmail.com

# Proxy configuration
# If you want to change the ports on which openvidu listens, uncomment the following lines

# Allows any request to http://DOMAIN_OR_PUBLIC_IP:HTTP_PORT/ to be automatically
# redirected to https://DOMAIN_OR_PUBLIC_IP:HTTPS_PORT/.
# WARNING: the default port 80 cannot be changed during the first boot
# if you have chosen to deploy with the option CERTIFICATE_TYPE=letsencrypt
HTTP_PORT=8084

# Changes the port of all services exposed by OpenVidu.
# SDKs, REST clients and browsers will have to connect to this port
HTTPS_PORT=8443

# Old paths are considered now deprecated, but still supported by default. 
# OpenVidu Server will log a WARN message every time a deprecated path is called, indicating 
# the new path that should be used instead. You can set property SUPPORT_DEPRECATED_API=false 
# to stop allowing the use of old paths.
# Default value is true
# SUPPORT_DEPRECATED_API=false

# If true request to with www will be redirected to non-www requests
# Default value is false
# REDIRECT_WWW=false

# How many workers to configure in nginx proxy. 
# The more workers, the more requests will be handled
# Default value is 10240
# WORKER_CONNECTIONS=10240

# Access restrictions
# In this section you will be able to restrict the IPs from which you can access to
# Openvidu API and the Administration Panel
# WARNING! If you touch this configuration you can lose access to the platform from some IPs.
# Use it carefully.

# This section limits access to the /dashboard (OpenVidu CE) and /inspector (OpenVidu Pro) pages.
# The form for a single IP or an IP range is:
# ALLOWED_ACCESS_TO_DASHBOARD=198.51.100.1 and ALLOWED_ACCESS_TO_DASHBOARD=198.51.100.0/24
# To limit multiple IPs or IP ranges, separate by commas like this:
# ALLOWED_ACCESS_TO_DASHBOARD=198.51.100.1, 198.51.100.0/24
# ALLOWED_ACCESS_TO_DASHBOARD=

# This section limits access to the Openvidu REST API.
# The form for a single IP or an IP range is:
# ALLOWED_ACCESS_TO_RESTAPI=198.51.100.1 and ALLOWED_ACCESS_TO_RESTAPI=198.51.100.0/24
# To limit multiple IPs or or IP ranges, separate by commas like this:
# ALLOWED_ACCESS_TO_RESTAPI=198.51.100.1, 198.51.100.0/24
# ALLOWED_ACCESS_TO_RESTAPI=

# Whether to enable recording module or not
OPENVIDU_RECORDING=false

# Use recording module with debug mode.
OPENVIDU_RECORDING_DEBUG=false

# Openvidu Folder Record used for save the openvidu recording videos. Change it
# with the folder you want to use from your host.
OPENVIDU_RECORDING_PATH=/opt/openvidu/recordings

# System path where OpenVidu Server should look for custom recording layouts
OPENVIDU_RECORDING_CUSTOM_LAYOUT=/opt/openvidu/custom-layout

# if true any client can connect to
# https://OPENVIDU_SERVER_IP:OPENVIDU_PORT/recordings/any_session_file.mp4
# and access any recorded video file. If false this path will be secured with
# OPENVIDU_SECRET param just as OpenVidu Server dashboard at
# https://OPENVIDU_SERVER_IP:OPENVIDU_PORT
# Values: true | false
OPENVIDU_RECORDING_PUBLIC_ACCESS=false

# Which users should receive the recording events in the client side
# (recordingStarted, recordingStopped). Can be all (every user connected to
# the session), publisher_moderator (users with role 'PUBLISHER' or
# 'MODERATOR'), moderator (only users with role 'MODERATOR') or none
# (no user will receive these events)
OPENVIDU_RECORDING_NOTIFICATION=publisher_moderator

# Timeout in seconds for recordings to automatically stop (and the session involved to be closed)
# when conditions are met: a session recording is started but no user is publishing to it or a session
# is being recorded and last user disconnects. If a user publishes within the timeout in either case,
# the automatic stop of the recording is cancelled
# 0 means no timeout
OPENVIDU_RECORDING_AUTOSTOP_TIMEOUT=120

# Maximum video bandwidth sent from clients to OpenVidu Server, in kbps.
# 0 means unconstrained
OPENVIDU_STREAMS_VIDEO_MAX_RECV_BANDWIDTH=1000

# Minimum video bandwidth sent from clients to OpenVidu Server, in kbps.
# 0 means unconstrained
OPENVIDU_STREAMS_VIDEO_MIN_RECV_BANDWIDTH=300

# Maximum video bandwidth sent from OpenVidu Server to clients, in kbps.
# 0 means unconstrained
OPENVIDU_STREAMS_VIDEO_MAX_SEND_BANDWIDTH=1000

# Minimum video bandwidth sent from OpenVidu Server to clients, in kbps.
# 0 means unconstrained
OPENVIDU_STREAMS_VIDEO_MIN_SEND_BANDWIDTH=300

# All sessions of OpenVidu will try to force this codec. If OPENVIDU_STREAMS_ALLOW_TRANSCODING=true
# when a codec can not be forced, transcoding will be allowed
# Values: MEDIA_SERVER_PREFERRED, NONE, VP8, VP9, H264
# Default value is MEDIA_SERVER_PREFERRED
# OPENVIDU_STREAMS_FORCED_VIDEO_CODEC=MEDIA_SERVER_PREFERRED

# Allow transcoding if codec specified in OPENVIDU_STREAMS_FORCED_VIDEO_CODEC can not be applied
# Values: true | false
# Default value is false
# OPENVIDU_STREAMS_ALLOW_TRANSCODING=false

# true to enable OpenVidu Webhook service. false' otherwise
# Values: true | false
OPENVIDU_WEBHOOK=false

# HTTP endpoint where OpenVidu Server will send Webhook HTTP POST messages
# Must be a valid URL: http(s)://ENDPOINT
#OPENVIDU_WEBHOOK_ENDPOINT=

# List of headers that OpenVidu Webhook service will attach to HTTP POST messages
#OPENVIDU_WEBHOOK_HEADERS=

# List of events that will be sent by OpenVidu Webhook service
# Default value is all available events
OPENVIDU_WEBHOOK_EVENTS=[sessionCreated,sessionDestroyed,participantJoined,participantLeft,webrtcConnectionCreated,webrtcConnectionDestroyed,recordingStatusChanged,filterEventDispatched,mediaNodeStatusChanged,nodeCrashed,nodeRecovered,broadcastStarted,broadcastStopped]

# How often the garbage collector of non active sessions runs.
# This helps cleaning up sessions that have been initialized through
# REST API (and maybe tokens have been created for them) but have had no users connected.
# Default to 900s (15 mins). 0 to disable non active sessions garbage collector
OPENVIDU_SESSIONS_GARBAGE_INTERVAL=900

# Minimum time in seconds that a non active session must have been in existence
# for the garbage collector of non active sessions to remove it. Default to 3600s (1 hour).
# If non active sessions garbage collector is disabled
# (property 'OPENVIDU_SESSIONS_GARBAGE_INTERVAL' to 0) this property is ignored
OPENVIDU_SESSIONS_GARBAGE_THRESHOLD=3600

# Call Detail Record enabled
# Whether to enable Call Detail Record or not
# Values: true | false
OPENVIDU_CDR=false

# Path where the cdr log files are hosted
OPENVIDU_CDR_PATH=/opt/openvidu/cdr

# Kurento Media Server image
# --------------------------
# Docker hub kurento media server: https://hub.docker.com/r/kurento/kurento-media-server
# Uncomment the next line and define this variable with KMS image that you want use
# KMS_IMAGE=kurento/kurento-media-server:7.1.1

# Kurento Media Server Level logs
# -------------------------------
# Uncomment the next line and define this variable to change
# the verbosity level of the logs of KMS
# Documentation: https://doc-kurento.readthedocs.io/en/stable/features/logging.html
# KMS_DOCKER_ENV_GST_DEBUG=

# Openvidu Server Level logs
# --------------------------
# Uncomment the next line and define this variable to change
# the verbosity level of the logs of Openvidu Service
# RECOMENDED VALUES: INFO for normal logs DEBUG for more verbose logs
# OV_CE_DEBUG_LEVEL=INFO

# Java Options
# --------------------------
# Uncomment the next line and define this to add
# options to java command
# Documentation: https://docs.oracle.com/cd/E37116_01/install.111210/e23737/configuring_jvm.htm#OUDIG00058
# JAVA_OPTIONS=-Xms2048m -Xmx4096m -Duser.timezone=UTC


``` docker-compose.override.yml
version: '3.1'

services:
    # --------------------------------------------------------------
    #
    #    Change this if your want use your own application.
    #    It's very important expose your application in port 5442
    #    and use the http protocol.
    #
    #    Default Application
    #
    #    Openvidu-Call Version: 2.31.0
    #
    # --------------------------------------------------------------
    app:
        image: openvidu/openvidu-call:2.31.0
        restart: on-failure
        network_mode: host
        environment:
            - SERVER_PORT=5442
            - OPENVIDU_URL=http://localhost:5443
            - OPENVIDU_SECRET=${OPENVIDU_SECRET}
            - CALL_OPENVIDU_CERTTYPE=${CERTIFICATE_TYPE}
            - CALL_PRIVATE_ACCESS=${CALL_PRIVATE_ACCESS:-}
            - CALL_USER=${CALL_USER:-}
            - CALL_SECRET=${CALL_SECRET:-}
            - CALL_ADMIN_SECRET=${CALL_ADMIN_SECRET:-}
            - CALL_RECORDING=${CALL_RECORDING:-}
        logging:
            options:
                max-size: "${DOCKER_LOGS_MAX_SIZE:-100M}"
    nginx:
        volumes:
            - /etc/letsencrypt:/etc/letsencrypt
        environment:
            - CERTIFICATE_TYPE=owncert
    openvidu-server:
        env_file:
            - .env
        volumes:
            - /opt/openvidu/.env:/opt/openvidu/.env
