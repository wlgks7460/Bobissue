package com.c108.springproject.admin.repository;

import com.c108.springproject.admin.domain.AdminBank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminBankRepository  extends JpaRepository<AdminBank, Integer> {
    AdminBank findByBankNo(int bankNo);
}
