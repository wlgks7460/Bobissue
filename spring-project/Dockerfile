# Step 1: Build stage
FROM openjdk:17-jdk-slim AS build

WORKDIR /app

# Gradle Wrapper 파일을 복사하고 Gradle 빌드 실행
COPY gradlew .
COPY gradle /gradle
COPY build.gradle .
COPY settings.gradle .
COPY src /src

RUN chmod +x gradlew && ./gradlew build

# Step 2: Run stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# 빌드된 Jar 파일을 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션 실행
CMD ["java", "-jar", "app.jar"]
