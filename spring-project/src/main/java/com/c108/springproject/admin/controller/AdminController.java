package com.c108.springproject.admin.controller;

import com.c108.springproject.admin.dto.AdminResDto;
import com.c108.springproject.admin.service.AdminService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseDto findAdminList() {
        List<AdminResDto> adminList = adminService.findAdminList();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_ADMIN, new DefaultResponse<List<AdminResDto>>(adminList));
    }

    @PutMapping("/{userNo}/user-status")
    public ResponseDto activateUserStatus(@PathVariable int userNo) {
        String status = adminService.changeUserStatus(userNo);

        if(status.equals("Y")){ //활성화로 변경되었을 경우
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_USER_STATUS, "ACTIVE");
        }else{ //비활성화로 변경되었을 경우
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_USER_STATUS, "DEACTIVE");
        }
    }

    @PutMapping("/{sellerNo}/seller-status")
    public ResponseDto activateSellerStatus(@PathVariable int sellerNo) {
        String status = adminService.changeSellerStatus(sellerNo);

        if(status.equals("Y")){
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_SELLER_STATUS, "ACTIVE");
        }else{
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_SELLER_STATUS, "DEACTIVE");
        }
    }
}