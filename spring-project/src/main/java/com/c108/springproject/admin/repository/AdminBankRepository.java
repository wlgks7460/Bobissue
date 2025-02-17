package com.c108.springproject.admin.repository;

import com.c108.springproject.admin.domain.AdminBank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminBankRepository  extends JpaRepository<AdminBank, Integer> {
}
