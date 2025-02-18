package com.c108.springproject.payment.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.payment.dto.PaymentItemReqDto;
import com.c108.springproject.payment.dto.UserOrderResDto;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public PaymentService(ItemRepository itemRepository, UserRepository userRepository){
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    // 주문 가능한 수량인지 체크 후 수량만큼 빼기
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public boolean checkOrder(List<PaymentItemReqDto> paymentList){
        try {
            for (PaymentItemReqDto dto : paymentList) {
                Item item = itemRepository.findById(dto.getItemNo())
                        .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

                if (item.getStock() < dto.getCount()) {
                    throw new BobIssueException(ResponseCode.NOT_ENOUGH_STOCK);
                }
            }

            // 모든 상품의 재고가 충분하면 차감 진행
            for (PaymentItemReqDto dto : paymentList) {
                Item item = itemRepository.findById(dto.getItemNo())
                        .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
                item.setStock(item.getStock()-dto.getCount());
            }

            return true;
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_ORDERABLE);
        }
    }

    // 결제 실패했을 때 재고 처리
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public void unorderable(List<PaymentItemReqDto> paymentList){

        // checkOrder에서 차감한 재고만큼 더함
        for (PaymentItemReqDto dto : paymentList) {
            Item item = itemRepository.findById(dto.getItemNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
            item.setStock(dto.getCount()+item.getStock());
            itemRepository.save(item);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public UserOrderResDto getUserOrderInfo(String email){

        User user = userRepository.findByEmail(email).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_USER));

        return UserOrderResDto.builder()
                .userNo(user.getUserNo())
                .point(user.getPoint())
                .baseAddress(user.getBaseAddress())
                .build();
    }
}
