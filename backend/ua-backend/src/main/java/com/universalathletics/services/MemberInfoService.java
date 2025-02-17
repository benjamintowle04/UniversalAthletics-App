package com.universalathletics.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.universalathletics.entities.MemberInfo;
import com.universalathletics.entities.dao.MemberInfoDao;

import java.util.List;

@Service
public class MemberInfoService {

    @Autowired
    private MemberInfoDao memberInfoDao;

    public List<MemberInfo> getAllMembers() {
        return memberInfoDao.getAllMembers();
    }

    public void saveMember(MemberInfo memberInfo) {
        memberInfoDao.saveMember(memberInfo);
    }
}
