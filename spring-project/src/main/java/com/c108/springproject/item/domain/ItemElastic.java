package com.c108.springproject.item.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "items", createIndex = true)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemElastic {

    @Id
    private int itemNo;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String companyName;

}