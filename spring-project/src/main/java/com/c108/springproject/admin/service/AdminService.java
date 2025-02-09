package com.c108.springproject.admin.service;

import com.c108.springproject.admin.dto.AdminResDto;
import com.c108.springproject.admin.repository.AdminRepository;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    public AdminService(AdminRepository adminRepository, UserRepository userRepository, SellerRepository sellerRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
    }

    @Transactional
    public List<AdminResDto> findAdminList() {
        return adminRepository.findAll().stream()
                .map(AdminResDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public String changeUserStatus(int userNo) {
        userRepository.changeUserStatus(userNo);
        return userRepository.findUserStatus(userNo);
    }

    @Transactional
    public String changeSellerStatus(int sellerNo) {
        sellerRepository.changeSellerStatus(sellerNo);
        return sellerRepository.findSellerStatus(sellerNo);
    }
}
