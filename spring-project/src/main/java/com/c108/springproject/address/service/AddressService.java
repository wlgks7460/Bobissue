package com.c108.springproject.address.service;

import com.c108.springproject.address.domain.Address;
import com.c108.springproject.address.dto.AddressReqDto;
import com.c108.springproject.address.dto.AddressResDto;
import com.c108.springproject.address.repository.AddressRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Address createAddress(AddressReqDto addressReqDto) {
        try {
            Address new_address = Address.builder()
                    .userNo(addressReqDto.getUserNo())
                    .postalCode(addressReqDto.getPostalCode())
                    .address(addressReqDto.getAddress())
                    .addressDetail(addressReqDto.getAddressDetail())
                    .name(addressReqDto.getName())
                    .build();
            return addressRepository.save(new_address);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_ADDRESS);
        }
    }

    @Transactional
    public List<Address> findAllAddress(int userNo) {
        try{
            List<Address> addressList = addressRepository.findAllByUserNo(userNo);
            return addressList;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_FIND_ALL_ADDRESS);
        }
    }

    @Transactional
    public AddressResDto findAddressByNo(int addressNo) {
        Address address = addressRepository.findById(addressNo).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));
        return AddressResDto.toDto(address);
    }

    @Transactional
    public AddressResDto updateAddress(int addressNo, AddressReqDto addressReqDto) {
        Address address=addressRepository.findById(addressNo).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_UPDATE_ADDRESS));
        address.changeAddressDetail(addressReqDto);
        return AddressResDto.toDto(address);
    }

    @Transactional
    public void deleteAddress(int addressNo) {
        Address address = addressRepository.findById(addressNo).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));
        try{
            address.setDelYn("Y");
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_ADDRESS);
        }
    }

    @Transactional
    public AddressResDto setBaseAddress(int userNo, int addressNo) {
        try{
            User user = userRepository.findById(userNo).orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_USER));
            user.setBaseAddress(addressNo);
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_SET_BASE_ADDRESS);
        }
        Address address = addressRepository.findById(addressNo).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));

        return AddressResDto.toDto(address);
    }

    @Transactional
    public AddressResDto getBaseAddress(int userNo) {
        User user = userRepository.findById(userNo).orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_USER));
        int addressNo = user.getBaseAddress();
        Address address = addressRepository.findById(addressNo).orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));

        return AddressResDto.toDto(address);
    }



}
