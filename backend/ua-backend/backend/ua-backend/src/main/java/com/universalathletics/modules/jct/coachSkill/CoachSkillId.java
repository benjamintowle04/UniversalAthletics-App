package com.universalathletics.modules.jct.coachSkill;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CoachSkillId implements Serializable {
    
    @Column(name = "Coach_ID")
    private Integer coachId;
    
    @Column(name = "Skill_ID")
    private Integer skillId;
    
    // Constructors
    public CoachSkillId() {}
    
    public CoachSkillId(Integer coachId, Integer skillId) {
        this.coachId = coachId;
        this.skillId = skillId;
    }
    
    // Getters and Setters
    public Integer getCoachId() {
        return coachId;
    }
    
    public void setCoachId(Integer coachId) {
        this.coachId = coachId;
    }
    
    public Integer getSkillId() {
        return skillId;
    }
    
    public void setSkillId(Integer skillId) {
        this.skillId = skillId;
    }
    
    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CoachSkillId that = (CoachSkillId) o;
        return Objects.equals(coachId, that.coachId) && Objects.equals(skillId, that.skillId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(coachId, skillId);
    }
}
