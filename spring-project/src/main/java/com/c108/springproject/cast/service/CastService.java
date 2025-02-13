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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

        if(castRepository.findByCastStatusAndCompany(CastStatus.REGISTER, seller.getCompany()).isPresent()){
            throw new BobIssueException(ResponseCode.ALREADY_REGISTER_CAST_COMPANY);
        }

        try{
            Cast new_cast = Cast.builder()
                    .seller(seller)
                    .company(seller.getCompany())
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
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<CastResDto> findRegisterCastList(){
        try{
            List<Cast> casts = castRepository.findByCastStatus(CastStatus.REGISTER);
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
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public CastResDto updateCast(int cast_no, CastReqDto castReqDto){
        //인증을 통한 권한 확인 필요
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Seller seller = sellerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()->new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        Seller registerSeller = sellerRepository.findByEmail(cast.extractEmail()).orElseThrow(()-> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        if(!seller.getCompany().equals(registerSeller.getCompany())){
            throw new BobIssueException(ResponseCode.UNAUTHORIZED);
        }
        if(!cast.getCastStatus().equals(CastStatus.REGISTER)){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_CAST);
        }

        try{

            cast.updateCast(castReqDto);

            // ✅ 2. 새로운 CastItem 리스트 생성
            List<CastItem> newCastItems = castReqDto.getItems().stream()
                    .map(dto -> {
                        Item item = itemRepository.findById(dto.getItemNo())
                                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
                        if (!seller.getCompany().equals(item.getCompany())) {
                            throw new BobIssueException(ResponseCode.UNAUTHORIZED_ITEM);
                        }
                        return CastItem.builder()
                                .cast(cast)
                                .item(item)
                                .build();
                    })
                    .collect(Collectors.toList());

            // ✅ 3. 기존 CastItem을 삭제하고 새로 설정
            cast.getCastItems().clear();  // 기존 데이터 자동 삭제 (orphanRemoval = true 덕분)
            cast.getCastItems().addAll(newCastItems);

            return CastResDto.toDto(cast);
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_CAST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN','SELLER')")
    public int deleteCast(int cast_no){
        //인증을 통한 권한 확인 필요
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("ADMIN"));

        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()->new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        if(isAdmin){
            try{
                cast.delete();
                List<CastItem> castItems = castItemRepository.findByCast(cast);
                for(CastItem castItem : castItems){
                    castItem.delete();
                }

                return cast.getCastNo();
            }catch (Exception e){
                throw new BobIssueException(ResponseCode.FAILED_DELETE_CAST);
            }
        }else{
            Seller endSeller = sellerRepository.findByEmail(authentication.getName()).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
            Seller registerSeller = sellerRepository.findByEmail(cast.extractEmail()).orElseThrow(()-> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

            if(!endSeller.getCompany().equals(registerSeller.getCompany())){
                throw new BobIssueException(ResponseCode.UNAUTHORIZED);
            }
            try{
                cast.delete();
                List<CastItem> castItems = castItemRepository.findByCast(cast);
                for(CastItem castItem : castItems){
                    castItem.delete();
                }
                return cast.getCastNo();
            }catch (Exception e){
                throw new BobIssueException(ResponseCode.FAILED_DELETE_CAST);
            }
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public CastResDto acceptCast(int cast_no){
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        if(cast.getCastStatus().equals(CastStatus.AWAIT)){
            throw new BobIssueException(ResponseCode.ALREADY_APPROVED_CAST);
        }

        if(cast.getCastStatus().equals(CastStatus.REFUSAL)){
            throw new BobIssueException(ResponseCode.ALREADY_REFUSAL_CAST);
        }

        if(cast.getCastStatus().equals(CastStatus.TERMINATE)){
            throw new BobIssueException(ResponseCode.ALREADY_TERMINATE_CAST);
        }

        try{
            cast.acceptCast();
            return CastResDto.toDto(cast);
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_ACCEPT_CAST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public int refusalCast(int cast_no){
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));

        if(cast.getCastStatus().equals(CastStatus.REFUSAL)){
            throw new BobIssueException(ResponseCode.ALREADY_REFUSAL_CAST);
        }

        if(cast.getCastStatus().equals(CastStatus.TERMINATE)){
            throw new BobIssueException(ResponseCode.ALREADY_TERMINATE_CAST);
        }

        try{
            cast.refusalCast();
            return cast.getCastNo();
        }catch (Exception e){
            throw new BobIssueException(ResponseCode.FAILED_REFUSAL_CAST);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public CastResDto startCast(int cast_no){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
        Seller startSeller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));
        Seller registerSeller = sellerRepository.findByEmail(cast.extractEmail()).orElseThrow(()-> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        if(!startSeller.getCompany().equals(registerSeller.getCompany())){
            throw new BobIssueException(ResponseCode.UNAUTHORIZED);
        }

        if(!cast.getCastStatus().equals(CastStatus.AWAIT)){
            throw new BobIssueException(ResponseCode.NOT_STARTABLE_CAST);
        }

        try {
            String castRoomId = UUID.randomUUID().toString();
            cast.startCast(castRoomId);
            return CastResDto.toDto(cast);
        }catch(Exception e){
            throw new BobIssueException(ResponseCode.FAILED_START_CAST);
        }

    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN','SELLER')")
    public CastResDto endCast(int cast_no){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Cast cast = castRepository.findByCastNo(cast_no).orElseThrow(()-> new BobIssueException(ResponseCode.CAST_NOT_FOUND));

        boolean isAdmin = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("ADMIN"));

        if(isAdmin){
            try{
                cast.endCast();
                return CastResDto.toDto(cast);
            }catch (Exception e){
                throw new BobIssueException(ResponseCode.FAILED_END_CAST);
            }
        }else{
            Seller endSeller = sellerRepository.findByEmail(authentication.getName()).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
            Seller registerSeller = sellerRepository.findByEmail(cast.extractEmail()).orElseThrow(()-> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

            if(!endSeller.getCompany().equals(registerSeller.getCompany())){
                throw new BobIssueException(ResponseCode.UNAUTHORIZED);
            }
            try{
                cast.endCast();
                return CastResDto.toDto(cast);
            }catch (Exception e){
                throw new BobIssueException(ResponseCode.FAILED_END_CAST);
            }
        }

    }

}
