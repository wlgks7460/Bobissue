package com.c108.springproject.cast.service;

import com.c108.springproject.cast.domain.Cast;
import com.c108.springproject.cast.dto.requset.CastReqDto;
import com.c108.springproject.cast.dto.response.CastResDto;
import com.c108.springproject.cast.repository.CastRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
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

    public CastService(CastRepository castRepository,
                       SellerRepository sellerRepository){
        this.castRepository = castRepository;
        this.sellerRepository =sellerRepository;
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
                    .castTime(castReqDto.getCastTime())
                    .build();
            return castRepository.save(new_cast);
        }catch (BobIssueException e){
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
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.CAST_NOT_FOUND);
        }
    }

    @Transactional
    public CastResDto findCastByNo(int cast_no){
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        return CastResDto.toDto(cast);
    }

    @Transactional
    public CastResDto updateCast(int cast_no, CastReqDto castReqDto){
        //인증을 통한 권한 확인 필요
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()->new BobIssueException(ResponseCode.CAST_NOT_FOUND));
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

}
