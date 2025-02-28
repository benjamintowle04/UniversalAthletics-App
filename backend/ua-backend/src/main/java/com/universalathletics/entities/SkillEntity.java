package com.universalathletics.entities;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

//-------------------------- Skill Entity Class ------------------------------//
/**
 * Entity class representing skills in the Universal Athletics system.
 * This class maps to the 'skills' table in the database and contains
 * information about different athletic skills and their grades.
 *
 */

@Entity
@Data
@Table(name = "skills")
@NoArgsConstructor
@AllArgsConstructor
public class SkillEntity {

          /**
           * Unique identifier for the skill.
           * Auto-generated using database identity strategy.
           */
          @Id
          @Column(name = "skill_id")
          @GeneratedValue(strategy = GenerationType.IDENTITY)
          private int skillId;

          /**
           * Title or name of the skill.
           */
          @Column(name = "title")
          private String title;

          /**
           * Grade or level of the skill.
           */
          @Column(name = "grade")
          private String grade;

          /**
           * Additional information or description about the skill.
           */
          @Column(name = "info")
          private String info;
}