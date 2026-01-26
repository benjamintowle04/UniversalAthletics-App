package com.universalathletics.modules.jct.memberCoach.entity;

import java.io.Serializable;
import java.util.Objects;

public class MemberCoachId implements Serializable {
    private Integer memberId;
    private Integer coachId;
    
    // Constructors
    public MemberCoachId() {}
    
    public MemberCoachId(Integer memberId, Integer coachId) {
        this.memberId = memberId;
        this.coachId = coachId;
    }
    
    // Getters and Setters
    public Integer getMemberId() {
        return memberId;
    }
    
    public void setMemberId(Integer memberId) {
        this.memberId = memberId;
    }
    
    public Integer getCoachId() {
        return coachId;
    }
    
    public void setCoachId(Integer coachId) {
        this.coachId = coachId;
    }
    
    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MemberCoachId that = (MemberCoachId) o;
        return Objects.equals(memberId, that.memberId) && Objects.equals(coachId, that.coachId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(memberId, coachId);
    }
}

