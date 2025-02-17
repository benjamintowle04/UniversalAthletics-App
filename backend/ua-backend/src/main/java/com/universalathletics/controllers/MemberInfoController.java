package com.universalathletics.controllers;

import com.universalathletics.entities.MemberInfo;
import com.universalathletics.services.MemberInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberInfoController {

    @Autowired
    private MemberInfoService memberInfoService;

    @GetMapping
    public List<MemberInfo> getAllMembers() {
        return memberInfoService.getAllMembers();
    }

    @PostMapping
    public void saveMember(@RequestBody MemberInfo memberInfo) {
        memberInfoService.saveMember(memberInfo);
    }
}