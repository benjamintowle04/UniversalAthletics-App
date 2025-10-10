package com.universalathletics.modules.jct.coachSkill.repository;

import com.universalathletics.modules.jct.coachSkill.entity.CoachSkillEntity;
import com.universalathletics.modules.jct.coachSkill.CoachSkillId;
import com.universalathletics.modules.jct.coachSkill.SkillLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoachSkillRepository extends JpaRepository<CoachSkillEntity, CoachSkillId> {
    
    // Use explicit queries instead of method name queries to avoid field name issues
    @Query("SELECT cs FROM CoachSkillEntity cs WHERE cs.coach.id = :coachId")
    List<CoachSkillEntity> findByCoachId(@Param("coachId") Integer coachId);
    
    @Query("SELECT cs FROM CoachSkillEntity cs WHERE cs.skill.skill_id = :skillId")
    List<CoachSkillEntity> findBySkillId(@Param("skillId") Integer skillId);
    
    @Query("SELECT cs FROM CoachSkillEntity cs WHERE cs.skillLevel = :skillLevel")
    List<CoachSkillEntity> findBySkillLevel(@Param("skillLevel") SkillLevel skillLevel);
    
    @Query("SELECT cs FROM CoachSkillEntity cs WHERE cs.coach.id = :coachId AND cs.skill.skill_id = :skillId")
    CoachSkillEntity findByCoachIdAndSkillId(@Param("coachId") Integer coachId, @Param("skillId") Integer skillId);
    
    @Query("SELECT cs FROM CoachSkillEntity cs WHERE cs.skill.skill_id IN :skillIds AND cs.skillLevel IN :skillLevels")
    List<CoachSkillEntity> findBySkillIdsAndSkillLevels(@Param("skillIds") List<Integer> skillIds, @Param("skillLevels") List<SkillLevel> skillLevels);
}
