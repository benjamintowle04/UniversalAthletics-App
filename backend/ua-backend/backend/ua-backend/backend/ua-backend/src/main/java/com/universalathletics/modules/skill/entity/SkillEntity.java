package com.universalathletics.modules.skill.entity;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

// Replace JsonBackReference with JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;

//-------------------------- Skill Entity Class ------------------------------//
/**
 * Entity class representing skills in the Universal Athletics system.
 * This class maps to the 'skills' table in the database and contains
 * information about different athletic skills and their grades.
 *
 */

@Entity
@Data
@Table(name = "skill")
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "coaches", "members"})
public class SkillEntity {

  /**
   * Unique identifier for the skill.
   * Auto-generated using database identity strategy.
   */
  @Id
  @Column(name = "skill_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int skill_id;

  /**
   * Title or name of the skill.
   */
  @Column(name = "title")
  private String title;

  // Define the junction table for many-to-many relationship with Members
  @ManyToMany(mappedBy = "skills", fetch = FetchType.LAZY)
  // This annotation prevents infinite recursion during JSON
  // serialization/deserialization
  // It tells Jackson to ignore the "skills" property in MemberInfoEntity when
  // serializing/deserializing
  @JsonIgnore
  private List<MemberInfoEntity> members;

  public int getSkill_id() {
    return this.skill_id;
  }

  public String getTitle() {
    return this.title;
  }
}