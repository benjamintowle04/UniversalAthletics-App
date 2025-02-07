package com.universalathletics.services;


import com.universalathletics.models.dao.MemberInfoDao;
import com.universalathletics.models.MemberInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
