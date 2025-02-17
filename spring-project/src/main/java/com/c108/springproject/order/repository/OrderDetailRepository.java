package com.c108.springproject.order.repository;

import com.c108.springproject.order.domain.OrderDetail;
import com.c108.springproject.seller.domain.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    List<OrderDetail> findByItem_Company_CompanyNoAndOrder_DelCategoryNo(int companyNo, int delCategoryNo);

}
