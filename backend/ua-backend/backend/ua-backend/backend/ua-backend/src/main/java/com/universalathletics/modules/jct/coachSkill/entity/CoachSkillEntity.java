package com.universalathletics.modules.jct.coachSkill.entity;

import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.skill.entity.SkillEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.universalathletics.modules.jct.coachSkill.SkillLevel;
import com.universalathletics.modules.jct.coachSkill.CoachSkillId;
import jakarta.persistence.*;

@Entity
@Table(name = "Coach_Skill")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CoachSkillEntity {

    @EmbeddedId
    private CoachSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("coachId")
    @JoinColumn(name = "Coach_ID")
    @JsonIgnoreProperties({"coachSkills", "members", "hibernateLazyInitializer", "handler"})
    private CoachEntity coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "Skill_ID")
    @JsonIgnoreProperties({"coaches", "members", "hibernateLazyInitializer", "handler"})
    private SkillEntity skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "Skill_Level", nullable = false)
    private SkillLevel skillLevel = SkillLevel.INTERMEDIATE;

    // Constructors
    public CoachSkillEntity() {}

    public CoachSkillEntity(CoachEntity coach, SkillEntity skill, SkillLevel skillLevel) {
        this.coach = coach;
        this.skill = skill;
        this.skillLevel = skillLevel;
        this.id = new CoachSkillId(
            coach != null ? coach.getId() : null,
            skill != null ? skill.getSkill_id() : null
        );
    }

    // Getters and Setters
    public CoachSkillId getId() {
        return id;
    }

    public void setId(CoachSkillId id) {
        this.id = id;
    }

    public CoachEntity getCoach() {
        return coach;
    }

    public void setCoach(CoachEntity coach) {
        this.coach = coach;
        if (this.id == null) {
            this.id = new CoachSkillId();
        }
        this.id.setCoachId(coach != null ? coach.getId() : null);
    }

    public SkillEntity getSkill() {
        return skill;
    }

    public void setSkill(SkillEntity skill) {
        this.skill = skill;
        if (this.id == null) {
            this.id = new CoachSkillId();
        }
        this.id.setSkillId(skill != null ? skill.getSkill_id() : null);
    }

    public SkillLevel getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
    }
}