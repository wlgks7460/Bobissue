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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public Address createAddress(AddressReqDto addressReqDto) {
        User user = userRepository.findById(addressReqDto.getUserNo()).orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_USER));
        try {
            Address new_address = Address.builder()
                    .user(user)
                    .postalCode(addressReqDto.getPostalCode())
                    .address(addressReqDto.getAddress())
                    .addressDetail(addressReqDto.getAddressDetail())
                    .name(addressReqDto.getName())
                    .build();
            return addressRepository.save(new_address);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_ADDRESS);
        }
    }

    @Transactional
    public List<Address> findAllAddress(int userNo) {
        try{
            List<Address> addressList = addressRepository.findAllByUserUserNoAndDelYn(userNo, "N");
            return addressList;
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_FIND_ALL_ADDRESS);
        }
    }

    @Transactional
    public AddressResDto findAddressByNo(int addressNo) {
        Address address = addressRepository.findByAddressNoAndDelYn(addressNo, "N").orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));
        return AddressResDto.toDto(address);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public AddressResDto updateAddress(int addressNo, AddressReqDto addressReqDto) {
        Address address=addressRepository.findByAddressNoAndDelYn(addressNo, "N").orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_UPDATE_ADDRESS));
        address.changeAddressDetail(addressReqDto);
        return AddressResDto.toDto(address);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public void deleteAddress(int addressNo) {
        Address address = addressRepository.findByAddressNoAndDelYn(addressNo, "N").orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));
        try{
            address.delete();
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_ADDRESS);
        }
    }

    // 기본 배송지 설정
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public AddressResDto setBaseAddress(int userNo, int addressNo) {
        try{
            User user = userRepository.findById(userNo).orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_USER));
            user.setBaseAddress(addressNo);
        }catch(Exception e){
            throw new BobIssueException(ResponseCode.FAILED_SET_BASE_ADDRESS);
        }
        Address address = addressRepository.findByAddressNoAndDelYn(addressNo, "N").orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));

        return AddressResDto.toDto(address);
    }

    // 기본 배송지 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public AddressResDto getBaseAddress(int userNo) {
        User user = userRepository.findById(userNo).orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_USER));
        int addressNo = user.getBaseAddress();
        Address address = addressRepository.findByAddressNoAndDelYn(addressNo, "N").orElseThrow(() -> new BobIssueException(ResponseCode.FAILED_FIND_ADDRESS));

        return AddressResDto.toDto(address);
    }
}
