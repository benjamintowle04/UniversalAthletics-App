package com.universalathletics.modules.jct.memberCoach.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Member_Coach")
@IdClass(MemberCoachId.class)
public class MemberCoachEntity {
    
    @Id
    @Column(name = "Member_ID")
    private Integer memberId;
    
    @Id
    @Column(name = "Coach_ID")
    private Integer coachId;
    
    // Constructors
    public MemberCoachEntity() {}
    
    public MemberCoachEntity(Integer memberId, Integer coachId) {
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
}

