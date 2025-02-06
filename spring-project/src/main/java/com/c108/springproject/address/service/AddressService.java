package com.c108.springproject.address.service;

import com.c108.springproject.address.domain.Address;
import com.c108.springproject.address.dto.AddressReqDto;
import com.c108.springproject.address.repository.AddressRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Transactional
    public Address createAddress(AddressReqDto addressReqDto) {
        try {
            Address new_address = Address.builder()
                    .userNo(addressReqDto.getUserNo())
                    .postalCode(addressReqDto.getPostalCode())
                    .address(addressReqDto.getAddress())
                    .addressDetail(addressReqDto.getAddressDetail())
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

}
