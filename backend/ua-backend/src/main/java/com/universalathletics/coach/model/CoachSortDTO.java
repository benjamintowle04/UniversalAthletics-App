package com.universalathletics.coach.model;
import com.universalathletics.skill.entity.SkillEntity;
import java.util.List;
import lombok.Data;


/**
 * Used to model the request body for sorting coaches by skills and location
 */
@Data
public class CoachSortDTO {
    private List<SkillEntity> skills;
    private String location;

    public CoachSortDTO(List<SkillEntity> skills, String location) {
        this.skills = skills;
        this.location = location;
    }

    public CoachSortDTO() {
        this.skills = null;
        this.location = null;
    }

    public List<SkillEntity> getSkills() {
        return this.skills;
    }

    public String getLocation() {
        return this.location;
    }

}
