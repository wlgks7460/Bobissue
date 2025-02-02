package com.c108.springproject.global.redis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration //이 클래스가 설정파일
@EnableCaching// Spring의 캐싱 기능 활성화
public class RedisConfig {

    @Value("${spring.data.redis.host")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private String redisPort;

    //Redis 서버와 연결하는 ConnectionFactory를 생성하여 반환함
    //나중에 Redis를 사용할 때, 이 ConnectionFactory를 기반으로 연결이 이루어짐
    @Bean
    public RedisConnectionFactory redisConnectionFactory(){
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(redisHost);
        redisStandaloneConfiguration.setPort(Integer.valueOf(redisPort));
        LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(redisStandaloneConfiguration);
        return lettuceConnectionFactory;
    }

    //Spring에서 Redis를 사용할 때 redisTemplate을 통해 데이터 저장 및 조회 가능
    //기본적으로 문자열(String) 기반의 직렬화 방식을 사용하여 저장
    @Bean
    public RedisTemplate<String, Object> redisTemplate(){
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
