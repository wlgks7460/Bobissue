package com.c108.springproject.seller.dto.request;


import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExtraAccountReqDto {
    private String email;
    private String password;
    private String callNumber;
    private String name;
}
