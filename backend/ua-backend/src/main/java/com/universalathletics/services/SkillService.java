package com.universalathletics.services;

//-------------------------------- Imports -----------------------------------//
import com.universalathletics.entities.SkillEntity;
import com.universalathletics.repositories.SkillRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


//-------------------------------- SkillService Class ----------------------//
/**
 * This service layer acts as an intermediary between the controller and
 * repository layers.
 * 
 * Responsibilities:
 * - Skill creation and management
 * - Skill data validation
 * - Skill information processing
 */
@Service
public class SkillService {

          /**
           * Autowired instance of SkillRepository for database operations.
           * Following Spring best practices for dependency injection.
           */
          @Autowired
          private SkillRepository skillRepository;

          // -------------------------------- Create Skill ------------------------------//
         
          /**
           * Creates or updates a skill in the database.(POST)
           * 
           * @param skill The SkillEntity object containing skill information
           * @return SkillEntity The saved skill object with generated ID
           * @throws IllegalArgumentException if skill is null
           */
            public SkillEntity saveSkill(SkillEntity skill) {
                    if (skill == null) {
                                throw new IllegalArgumentException("Skill information cannot be null");
                    }
                    return skillRepository.save(skill);
            }

          // -------------------------------- Get All Skills ------------------------------//
            /**
             * Retrieves all skills from the database.  
             * @return List<SkillEntity> A list of all skills in the database
            */
            public List<SkillEntity> getAllSkills() {
                return skillRepository.findAll();
            }
}