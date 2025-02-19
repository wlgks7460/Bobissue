package com.c108.springproject.cast.controller;

import com.c108.springproject.cast.domain.Cast;
import com.c108.springproject.cast.dto.requset.CastReqDto;
import com.c108.springproject.cast.dto.response.CastResDto;
import com.c108.springproject.cast.service.CastService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cast")
public class CastController {

    private final CastService castService;

    public CastController(CastService castService){
        this.castService =  castService;
    }

    @PostMapping("")
    public ResponseDto createCast(@RequestBody CastReqDto castReqDto){
        Cast cast = castService.createCast(castReqDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_CAST, new DefaultResponse<Integer>(cast.getCastNo()));
    }

    @GetMapping("")
    public ResponseDto findAllCast(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_CAST, new DefaultResponse.ListResponse<CastResDto>(castService.findAllCast()));
    }

    @GetMapping("/{cast_no}")
    public ResponseDto findCastByNo(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CAST, new DefaultResponse<CastResDto>(castService.findCastByNo(cast_no)));
    }

    @GetMapping("/registerList")
    public ResponseDto registerCastList(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CAST, new DefaultResponse.ListResponse<CastResDto>(castService.findRegisterCastList()));
    }

    @PatchMapping("/{cast_no}/accept")
    public ResponseDto acceptCast(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_ACCEPT_CAST, new DefaultResponse<CastResDto>(castService.acceptCast(cast_no)));
    }

    @PatchMapping("/{cast_no}/refusal")
    public ResponseDto refusalCast(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_REFUSAL_CAST, new DefaultResponse<Integer>(castService.refusalCast(cast_no)));
    }

    @PatchMapping("/{cast_no}/start")
    public ResponseDto startCast(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_START_CAST, new DefaultResponse<CastResDto>(castService.startCast(cast_no)));
    }

    @PatchMapping("/{cast_no}/end")
    public ResponseDto endCast(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_END_CAST, new DefaultResponse<CastResDto>(castService.endCast(cast_no)));
    }

    @PutMapping("/{cast_no}")
    public ResponseDto updateCast(@PathVariable int cast_no, @RequestBody CastReqDto castReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_CAST, new DefaultResponse<CastResDto>(castService.updateCast(cast_no, castReqDto)));
    }

    @DeleteMapping("/{cast_no}")
    public ResponseDto deleteCast(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_CAST, new DefaultResponse<Integer>(castService.deleteCast(cast_no)));
    }

    @GetMapping("/todayList")
    public ResponseDto todayList(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_TODAY_LIST, new DefaultResponse.ListResponse<CastResDto>(castService.findTodayList()));
    }

}
