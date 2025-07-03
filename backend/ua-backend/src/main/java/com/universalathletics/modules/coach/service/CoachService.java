package com.universalathletics.modules.coach.service;

//------------------------------- imports ------------------------------------//
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.coach.repository.CoachRepository;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.skill.entity.SkillEntity;
import com.universalathletics.modules.skill.repository.SkillRepository;

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

    // --------------------------------- Get All Coaches
    // --------------------------//
    /**
     * Retrieves all coachs from the database.(GET)
     *
     * @return List<CoachEntity> containing all coachs
     */
    public List<CoachEntity> findAllCoaches() {
        return coachRepository.findAll();
    }

    /**
     * Retrieves all members associated with a specific coach.
     * 
     * @param coachId The unique identifier of the coach
     * @return List of MemberInfoEntity objects associated with the coach, or empty list if none found
     * @throws EntityNotFoundException if the coach with the given ID doesn't exist
     */
    public List<MemberInfoEntity> getCoachMembers(Integer id) {
        CoachEntity coach = coachRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Coach not found with id: " + id));

        // The members are already loaded via the @ManyToMany relationship
        // Just return the list from the entity
        return coach.getMembers();
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

    // -----------------------Get Coach By Firebase ID---------------------//
    /**
     * Retrieves a coach by their Firebase ID.(GET)
     *
     * @param firebaseID The Firebase ID of the coach to find
     * @return CoachEntity if found
     * @throws EntityNotFoundException if coach not found
     */
    public CoachEntity findCoachByFirebaseID(String firebaseID) {
        return coachRepository.findByFirebaseID(firebaseID)
                .orElseThrow(() -> new EntityNotFoundException("Coach not found with Firebase ID: " + firebaseID));
    }
}
