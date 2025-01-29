package com.c108.springproject.admin.dto;

import com.c108.springproject.admin.domain.Admin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminResDto {
    private String adminId;
    private String adminPassword;

    public AdminResDto(Admin admin) {
        this.adminId=admin.getAdminId();
        this.adminPassword= admin.getAdminPassword();
    }

}
