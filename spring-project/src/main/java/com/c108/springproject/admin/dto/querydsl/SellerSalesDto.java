package com.c108.springproject.admin.dto.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerSalesDto {
    private int sellerNo;
    private String sellerName;
    private String companyName;
    private Long totalSales;
}
