package com.universalathletics.coach.service;

//------------------------------- imports ------------------------------------//
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.universalathletics.coach.entity.CoachEntity;
import com.universalathletics.coach.repository.CoachRepository;
import com.universalathletics.skill.entity.SkillEntity;
import com.universalathletics.skill.repository.SkillRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

//--------------------- Coach Service Class -----------------------------//
/**
 * CoachService handles all business logic related to coach operations in
 * the
 * Universal Athletics application.
 * This service layer acts as an intermediary between the controller and
 * repository layers.
 * 
 * Responsibilities:
 * - Coach creation and management
 * - Coach data validation
 * - Coach information processing
 */
@Service
public class CoachService {

    /**
     * Autowired instance of CoachRepository for database operations.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private CoachRepository coachRepository;

    /**
     * Autowired instance of SkillRepository for database operations.
     */
    @Autowired
    private SkillRepository skillRepository;

    // -------------------------------- Create Coach ----------------------------//
    /**
     * Creates or updates a coach in the database.(POST)
     * 
     * @param coach The CoachEntity object containing coach information
     * @return CoachEntity The saved coach object with generated ID
     * @throws IllegalArgumentException if coach is null
     */
    public CoachEntity saveCoach(CoachEntity coach) {
        if (coach == null) {
            throw new IllegalArgumentException("Coach information cannot be null");
        }

        // List to hold valid skills for the coach
        List<SkillEntity> validSkills = new ArrayList<>();

        // Ensure skills are managed before saving coach
        if (coach.getSkills() != null) {
            for (SkillEntity skill : coach.getSkills()) {
                // Check if the skill exists in the repository
                Optional<SkillEntity> existingSkill = skillRepository.findById(skill.getSkill_id());

                if (existingSkill.isPresent()) {
                    // If the skill exists, add it to the validSkills list
                    validSkills.add(existingSkill.get());
                } else {
                    // If the skill does not exist, throw an exception
                    throw new EntityNotFoundException("Skill not found with id: " + skill.getSkill_id());
                }
            }
            // Set the valid skills to the coach
            coach.setSkills(validSkills);
        }

        return coachRepository.save(coach);
    }

    // -------------------------------- Get Coach By ID -------------------------//
    /**
     * Retrieves a coach by their ID.(GET)
     *
     * @param id The ID of the coach to find
     * @return CoachEntity if found
     * @throws EntityNotFoundException if coach not found
     */
    public CoachEntity findCoachById(Integer id) {
        return coachRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Coach not found with id: " + id));
    }

    // --------------------------------- Get All Coachs
    // --------------------------//
    /**
     * Retrieves all coachs from the database.(GET)
     *
     * @return List<CoachEntity> containing all coachs
     */
    public List<CoachEntity> findAllCoaches() {
        return coachRepository.findAll();
    }



    // --------------------------------- Delete Coach
    // ----------------------------//
    /**
     * Deletes a coach from the database.(DELETE)
     * 
     * @param id The ID of the coach to delete
     * @return String Success message indicating coach deletion
     * @throws EntityNotFoundException if coach not found
     */
    public String deleteCoach(Integer id) {
        if (!coachRepository.existsById(id)) {
            throw new EntityNotFoundException("Coach not found with id: " + id);
        }
        coachRepository.deleteById(id);
        return "Coach with ID: " + id + " has been successfully deleted";
    }
}
