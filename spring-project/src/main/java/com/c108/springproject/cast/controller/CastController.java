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
@CrossOrigin(origins = "http://localhost:5173")
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

    @PutMapping("/{cast_no}")
    public ResponseDto updateCast(@PathVariable int cast_no, @RequestBody CastReqDto castReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_CAST, new DefaultResponse<CastResDto>(castService.updateCast(cast_no, castReqDto)));
    }

    @DeleteMapping("/{cast_no}")
    public ResponseDto deleteCast(@PathVariable int cast_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_CAST, new DefaultResponse<Integer>(castService.deleteCast(cast_no)));
    }

}
