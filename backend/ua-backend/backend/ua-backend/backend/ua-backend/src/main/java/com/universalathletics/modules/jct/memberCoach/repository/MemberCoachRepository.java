package com.universalathletics.modules.jct.memberCoach.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.universalathletics.modules.jct.memberCoach.entity.MemberCoachEntity;
import com.universalathletics.modules.jct.memberCoach.entity.MemberCoachId;

@Repository
public interface MemberCoachRepository extends JpaRepository<MemberCoachEntity, MemberCoachId> {
    
    /**
     * Check if a member-coach relationship already exists.
     * 
     * @param memberId The member ID
     * @param coachId The coach ID
     * @return true if the relationship exists, false otherwise
     */
    boolean existsByMemberIdAndCoachId(Integer memberId, Integer coachId);
}

