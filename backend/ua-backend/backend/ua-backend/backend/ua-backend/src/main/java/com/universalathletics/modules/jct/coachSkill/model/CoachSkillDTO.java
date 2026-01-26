package com.universalathletics.modules.jct.coachSkill.model;

import com.universalathletics.modules.jct.coachSkill.*;

public class CoachSkillDTO {
    private Integer skillId;
    private String skillTitle;
    private SkillLevel skillLevel;
    
    public CoachSkillDTO() {}
    
    public CoachSkillDTO(Integer skillId, String skillTitle, SkillLevel skillLevel) {
        this.skillId = skillId;
        this.skillTitle = skillTitle;
        this.skillLevel = skillLevel;
    }
    
    public Integer getSkillId() {
        return skillId;
    }
    
    public void setSkillId(Integer skillId) {
        this.skillId = skillId;
    }
    
    public String getSkillTitle() {
        return skillTitle;
    }
    
    public void setSkillTitle(String skillTitle) {
        this.skillTitle = skillTitle;
    }
    
    public SkillLevel getSkillLevel() {
        return skillLevel;
    }
    
    public void setSkillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
    }
}
