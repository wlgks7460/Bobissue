//package com.c108.springproject.global.elastic;
//
//import co.elastic.clients.elasticsearch.ElasticsearchClient;
//import co.elastic.clients.transport.rest_client.RestClientTransport;
//import org.apache.http.HttpHost;
//import org.elasticsearch.client.RestClient;
//import org.elasticsearch.client.RestClientBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class ElasticsearchConfig {
//
//    @Bean
//    public RestClient restClient() {
//        return RestClient.builder(
//                new HttpHost("bobissue.store", 9200, "http")
//        ).build();
//    }
//
//    @Bean
//    public ElasticsearchClient elasticsearchClient(RestClient restClient) {
//        RestClientTransport transport = new RestClientTransport(
//                restClient, new co.elastic.clients.json.jackson.JacksonJsonpMapper()
//        );
//        return new ElasticsearchClient(transport);
//    }
//}
