package com.c108.springproject.global.s3;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Amazon S3 관련 작업을 처리하는 서비스 클래스
 */
@Service // 스프링의 서비스 계층임을 나타내는 어노테이션
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성하는 롬복 어노테이션
public class S3Service {
    // AWS S3 관련 작업을 수행하는 클라이언트 객체
    private final AmazonS3Client amazonS3Client;

    // application.yml에서 설정한 버킷 이름을 주입받음
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * 단일 파일을 S3에 업로드하는 메서드
     *
     * @param dirName 파일이 저장될 S3 버킷 내의 디렉토리 경로 (예: "review", "item" 등)
     * @param file 업로드할 MultipartFile 객체
     * @return 업로드된 파일의 접근 가능한 URL
     * @throws BobIssueException 파일 업로드 실패 시 발생하는 예외
     */
    public String uploadFile(String dirName, MultipartFile file) {
        try {
            // 파일 유효성 검사 수행 (파일 형식, 크기 등 체크)
            validateFile(file);

            // UUID를 포함한 고유한 파일명 생성
            String fileName = createFileName(getExtension(file.getOriginalFilename()));

            // S3에 저장될 전체 경로 생성 (디렉토리명 + 파일명)
            String fileUrl = dirName + "/" + fileName;

            // S3에 업로드할 파일의 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType()); // 파일의 MIME 타입 설정
            metadata.setContentLength(file.getSize()); // 파일 크기 설정

            // S3에 파일 업로드 수행
            amazonS3Client.putObject(
                    new PutObjectRequest(bucket, fileUrl, file.getInputStream(), metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead) // 파일을 공개적으로 읽을 수 있게 설정
            );

            // 업로드된 파일의 public URL 반환
            return amazonS3Client.getUrl(bucket, fileUrl).toString();

        } catch (IOException e) {
            // 파일 업로드 중 오류 발생 시 커스텀 예외 발생
            throw new BobIssueException(ResponseCode.FILE_UPLOAD_ERROR);
        }
    }

    /**
     * 업로드될 파일의 유효성을 검사하는 메서드
     *
     * @param file 검사할 MultipartFile 객체
     * @throws BobIssueException 유효성 검사 실패 시 발생하는 예외
     */
    private void validateFile(MultipartFile file) {
        // 파일의 MIME 타입 검사
        String contentType = file.getContentType();
        // null이거나 이미지 파일이 아닌 경우 예외 발생
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BobIssueException(ResponseCode.INVALID_FILE_TYPE);
        }

        // 파일 크기 검사 (10MB 제한)
        // 10MB = 10 * 1024 * 1024 bytes
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BobIssueException(ResponseCode.FILE_SIZE_EXCEED);
        }
    }

    /**
     * 여러 개의 파일을 한 번에 업로드하는 메서드
     *
     * @param dirName 파일들이 저장될 S3 버킷 내의 디렉토리 경로
     * @param files 업로드할 MultipartFile 객체들의 리스트
     * @return 업로드된 모든 파일들의 URL 리스트
     */
    public List<String> uploadFiles(String dirName, List<MultipartFile> files) {
        // Stream을 사용하여 각 파일을 uploadFile 메서드로 처리하고 URL 리스트 반환
        return files.stream()
                .map(file -> uploadFile(dirName, file))
                .collect(Collectors.toList());
    }

    /**
     * 고유한 파일명을 생성하는 메서드
     * 형식: yyyyMMddHHmmss-UUID.확장자
     *
     * @param ext 파일 확장자 (예: ".jpg", ".png")
     * @return 생성된 고유한 파일명
     */
    private String createFileName(String ext) {
        // 현재 날짜/시간을 지정된 형식으로 포매팅
        return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date())
                + "-"
                + UUID.randomUUID().toString() // 충돌 방지를 위한 랜덤 UUID 생성
                + ext; // 원본 파일의 확장자 추가
    }

    /**
     * 파일명에서 확장자를 추출하는 메서드
     *
     * @param fileName 원본 파일명
     * @return 파일의 확장자 (".jpg" 등). 확장자가 없는 경우 빈 문자열 반환
     */
    private String getExtension(String fileName) {
        if (fileName == null) return ""; // 파일명이 null인 경우
        int lastIndex = fileName.lastIndexOf("."); // 마지막 점(.)의 위치 찾기
        if (lastIndex == -1) return ""; // 확장자가 없는 경우
        return fileName.substring(lastIndex); // 확장자 반환 (점 포함)
    }

    public void deleteFile(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);
            System.out.println("Deleting file with key: " + key);  // 로그 추가
            amazonS3Client.deleteObject(bucket, key);
        } catch (Exception e) {
            System.out.println("Error while deleting file: " + e.getMessage());  // 에러 로그 추가
            throw new BobIssueException(ResponseCode.FAILED_DELETE_IMAGE);
        }
    }

    public void deleteFiles(List<String> fileUrls) {
        for (String fileUrl:fileUrls) {
            deleteFile(fileUrl);
        }
    }


    private String extractKeyFromUrl(String fileUrl) {
        try {
            java.net.URL url = new java.net.URL(fileUrl);
            String path = url.getPath();
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            return path;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.INVALID_FILE_URL);
        }
    }

}