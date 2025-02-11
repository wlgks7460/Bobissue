package com.c108.springproject.cast.service;

import com.c108.springproject.cast.domain.Cast;
import com.c108.springproject.cast.domain.CastItem;
import com.c108.springproject.cast.domain.CastStatus;
import com.c108.springproject.cast.dto.requset.CastItemReqDto;
import com.c108.springproject.cast.dto.requset.CastReqDto;
import com.c108.springproject.cast.dto.response.CastResDto;
import com.c108.springproject.cast.repository.CastItemRepository;
import com.c108.springproject.cast.repository.CastRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.repository.SellerRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CastService {

    private final CastRepository castRepository;
    private final SellerRepository sellerRepository;
    private final ItemRepository itemRepository;
    private final CastItemRepository castItemRepository;

    public CastService(CastRepository castRepository,
                       SellerRepository sellerRepository,
                       ItemRepository itemRepository,
                       CastItemRepository castItemRepository){
        this.castRepository = castRepository;
        this.sellerRepository =sellerRepository;
        this.itemRepository = itemRepository;
        this.castItemRepository = castItemRepository;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public Cast createCast(CastReqDto castReqDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getName());
        Seller seller = sellerRepository.findByEmail(authentication.getName()).orElseThrow(()-> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        try{
            Cast new_cast = Cast.builder()
                    .sellerNo(seller)
                    .title(castReqDto.getTitle())
                    .content(castReqDto.getContent())
                    .startAt(castReqDto.getStartAt())
                    .endAt(castReqDto.getEndAt())
                    .castStatus(CastStatus.REGISTER)
                    .build();
            castRepository.save(new_cast);

            List<CastItemReqDto> castItemReqDtos = castReqDto.getItems();

            for(CastItemReqDto castItemReqDto : castItemReqDtos){
                Item item = itemRepository.findById(castItemReqDto.getItemNo()).orElseThrow(()-> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
                if(seller.getCompany().getCompanyNo() != item.getCompany().getCompanyNo()){
                    throw new BobIssueException(ResponseCode.UNAUTHORIZED_ITEM);
                }

                CastItem castItem = CastItem.builder()
                        .cast(new_cast)
                        .item(item)
                        .build();
                castItemRepository.save(castItem);
            }

            return castRepository.findByCastNo(new_cast.getCastNo()).orElseThrow(() -> new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_CREATE_CAST);
        }
    }

    @Transactional
    public List<CastResDto> findAllCast(){
        try{
            List<Cast> casts = castRepository.findAll();
            List<CastResDto> castResDtos = new ArrayList<>();
            for(Cast cast : casts){
                castResDtos.add(CastResDto.toDto(cast));
            }
            return castResDtos;
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.CAST_NOT_FOUND);
        }
    }

    @Transactional
    public CastResDto findCastByNo(int cast_no){
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        return CastResDto.toDto(cast);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public CastResDto updateCast(int cast_no, CastReqDto castReqDto){
        //인증을 통한 권한 확인 필요
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Seller seller = sellerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()->new BobIssueException(ResponseCode.CAST_NOT_FOUND));

//        String created_user = cast.getCreatedUser();
        try{
            cast.updateCast(castReqDto);
            return CastResDto.toDto(cast);
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_CAST);
        }
    }

    @Transactional
    public int deleteCast(int cast_no){
        //인증을 통한 권한 확인 필요
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()->new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        try{
            cast.delete();
            return cast.getCastNo();
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_CAST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public int registerCast(int cast_no){
        try{
            Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));
            cast.registerCast();
            return cast.getCastNo();
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_REGISTER_CAST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public int refusalCast(int cast_no){
        try{
            Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));
            cast.refusalCast();
            return cast.getCastNo();
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_REFUSAL_CAST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public int startCast(int cast_no){
//        try {
//
//        }
        return 1;
    }

}
