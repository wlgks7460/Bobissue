package com.c108.springproject.address.controller;

import com.c108.springproject.address.domain.Address;
import com.c108.springproject.address.dto.AddressListReqDto;
import com.c108.springproject.address.dto.AddressReqDto;
import com.c108.springproject.address.dto.AddressResDto;
import com.c108.springproject.address.service.AddressService;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;
    private final UserService userService;

    @Autowired
    public AddressController(AddressService addressService, UserService userService) {
        this.addressService = addressService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseDto createAddress(@RequestBody AddressReqDto addressReqDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        int userNo = userService.findByEmail(email).getUserNo();
        addressReqDto.setUserNo(userNo);

        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_ADDRESS, new DefaultResponse<Integer>(addressService.createAddress(addressReqDto).getAddressNo()));
    }

    @PostMapping("/list")
    public ResponseDto findAllAddress(@RequestBody AddressListReqDto addressListReqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_ADDRESS, new DefaultResponse<List<Address>>(addressService.findAllAddress(addressListReqDto.getUserNo())));
    }

    @GetMapping("/{address_no}")
    public ResponseDto findAddress(@PathVariable int address_no) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ADDRESS, new DefaultResponse<AddressResDto>(addressService.findAddressByNo(address_no)));
    }

    @PutMapping("/{address_no}")
    public ResponseDto updateAddress(@PathVariable int address_no, @RequestBody AddressReqDto addressReqDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        int userNo = userService.findByEmail(email).getUserNo();
        addressReqDto.setUserNo(userNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_ADDRESS, new DefaultResponse<AddressResDto>(addressService.updateAddress(address_no,addressReqDto)));
    }

    @DeleteMapping("/{address_no}")
    public ResponseDto deleteAddress(@PathVariable int address_no) {
        addressService.deleteAddress(address_no);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_ADDRESS, null);
    }

    @PostMapping("/base")
    public ResponseDto setBaseAddress(@RequestBody int addressNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        int userNo = userService.findByEmail(email).getUserNo();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_SET_BASE_ADDRESS, new DefaultResponse<AddressResDto>(addressService.setBaseAddress(userNo, addressNo)));
    }

    @GetMapping("/base")
    public ResponseDto getBaseAddress() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        int userNo = userService.findByEmail(email).getUserNo();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_BASE_ADDRESS, new DefaultResponse<AddressResDto>(addressService.getBaseAddress(userNo)));
    }



}
