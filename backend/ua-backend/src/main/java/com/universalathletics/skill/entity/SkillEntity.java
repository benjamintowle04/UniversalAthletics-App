package com.universalathletics.skill.entity;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

import com.universalathletics.memberInfo.entity.MemberInfoEntity;

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
          @ManyToMany(mappedBy = "skill", fetch = FetchType.LAZY)
          private List<MemberInfoEntity> members;
}