package com.universalathletics.modules.coach.service;

//------------------------------- imports ------------------------------------//
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.coach.repository.CoachRepository;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.skill.entity.SkillEntity;
import com.universalathletics.modules.skill.repository.SkillRepository;

import com.universalathletics.modules.jct.coachSkill.entity.CoachSkillEntity;
import com.universalathletics.modules.jct.coachSkill.SkillLevel;
import com.universalathletics.modules.jct.coachSkill.model.CoachSkillDTO;
import com.universalathletics.modules.jct.coachSkill.repository.CoachSkillRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

//--------------------- Coach Service Class -----------------------------//
/**
 * CoachService handles all business logic related to coach operations in
 * the Universal Athletics application.
 * This service layer acts as an intermediary between the controller and
 * repository layers.
 * 
 * Responsibilities:
 * - Coach creation and management
 * - Coach data validation
 * - Coach information processing
 * - Coach skill level management
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

    /**
     * Autowired instance of CoachSkillRepository for managing coach-skill
     * relationships with levels.
     */
    @Autowired
    private CoachSkillRepository coachSkillRepository;

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

        // Save the coach first (without skills for now)
        CoachEntity savedCoach = coachRepository.save(coach);

        return savedCoach;
    }

    // -------------------------------- Update Coach ----------------------------//
    /**
     * Updates an existing coach's profile information (PUT)
     * 
     * @param coach The CoachEntity object containing updated coach information
     * @return CoachEntity The updated coach object
     * @throws EntityNotFoundException if coach not found
     */
    public CoachEntity updateCoach(CoachEntity coach) {
        if (coach == null) {
            throw new IllegalArgumentException("Coach information cannot be null");
        }

        CoachEntity existingCoach = coachRepository.findByFirebaseID(coach.getFirebaseID())
                .orElseThrow(
                        () -> new EntityNotFoundException("Coach not found with firebaseId: " + coach.getFirebaseID()));

        existingCoach.setFirstName(coach.getFirstName());
        existingCoach.setLastName(coach.getLastName());
        existingCoach.setEmail(coach.getEmail());
        existingCoach.setPhone(coach.getPhone());
        existingCoach.setBiography1(coach.getBiography1());
        existingCoach.setBiography2(coach.getBiography2());
        existingCoach.setLocation(coach.getLocation());

        if (coach.getProfilePic() != null) {
            existingCoach.setProfilePic(coach.getProfilePic());
        }
        if (coach.getBioPic1() != null) {
            existingCoach.setBioPic1(coach.getBioPic1());
        }
        if (coach.getBioPic2() != null) {
            existingCoach.setBioPic2(coach.getBioPic2());
        }

        // --- Synchronize skillsWithLevels if provided ---
        if (coach.getSkillsWithLevels() != null) {
            List<CoachSkillEntity> currentSkills = coachSkillRepository.findByCoachId(existingCoach.getId());
            // Map current skills for quick lookup
            java.util.Map<Integer, CoachSkillEntity> currentSkillMap = new java.util.HashMap<>();
            for (CoachSkillEntity cse : currentSkills) {
                currentSkillMap.put(cse.getSkill().getSkill_id(), cse);
            }

            // Track skill IDs from the update request
            java.util.Set<Integer> updatedSkillIds = new java.util.HashSet<>();

            // Add or update skills
            for (CoachSkillDTO skillDTO : coach.getSkillsWithLevels()) {
                updatedSkillIds.add(skillDTO.getSkillId());
                CoachSkillEntity existing = currentSkillMap.get(skillDTO.getSkillId());
                if (existing != null) {
                    // Update skill level if changed
                    if (!existing.getSkillLevel().equals(skillDTO.getSkillLevel())) {
                        existing.setSkillLevel(skillDTO.getSkillLevel());
                        coachSkillRepository.save(existing);
                    }
                } else {
                    // Add new skill
                    SkillEntity skill = skillRepository.findById(skillDTO.getSkillId())
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Skill not found with id: " + skillDTO.getSkillId()));

                    if (existingCoach.getId() == null) {
                        throw new IllegalStateException("Coach ID is null before saving CoachSkillEntity");
                    }
                    if (skill.getSkill_id() == 0) {
                        throw new IllegalStateException("Skill ID is zero (invalid) before saving CoachSkillEntity");
                    }
                    CoachSkillEntity newCoachSkill = new CoachSkillEntity(existingCoach, skill,
                            skillDTO.getSkillLevel());

                    System.out.println("Saving CoachSkillEntity: coachId=" + existingCoach.getId() +
                            ", skillId=" + skill.getSkill_id() +
                            ", skillLevel=" + skillDTO.getSkillLevel());
                            
                    coachSkillRepository.save(newCoachSkill);
                }
            }

            // Remove skills that are no longer present
            for (CoachSkillEntity cse : currentSkills) {
                if (!updatedSkillIds.contains(cse.getSkill().getSkill_id())) {
                    coachSkillRepository.delete(cse);
                }
            }
        }

        return coachRepository.save(existingCoach);
    }

    /**
     * Saves coach skills with their respective skill levels.
     * 
     * @param coachId     The ID of the coach
     * @param coachSkills List of CoachSkillDTO containing skill information and
     *                    levels
     * @return List of saved CoachSkillEntity objects
     */
    public List<CoachSkillEntity> saveCoachSkills(Integer coachId, List<CoachSkillDTO> coachSkills) {
        CoachEntity coach = findCoachById(coachId);
        List<CoachSkillEntity> savedSkills = new ArrayList<>();

        // First, remove existing skills for this coach
        List<CoachSkillEntity> existingSkills = coachSkillRepository.findByCoachId(coachId);
        coachSkillRepository.deleteAll(existingSkills);

        // Add new skills with levels
        for (CoachSkillDTO skillDTO : coachSkills) {
            SkillEntity skill = skillRepository.findById(skillDTO.getSkillId())
                    .orElseThrow(
                            () -> new EntityNotFoundException("Skill not found with id: " + skillDTO.getSkillId()));

            CoachSkillEntity coachSkill = new CoachSkillEntity(coach, skill, skillDTO.getSkillLevel());
            savedSkills.add(coachSkillRepository.save(coachSkill));
        }

        return savedSkills;
    }

    /**
     * Gets all skills for a coach with their skill levels.
     * 
     * @param coachId The ID of the coach
     * @return List of CoachSkillDTO objects
     */
    public List<CoachSkillDTO> getCoachSkills(Integer coachId) {
        List<CoachSkillEntity> coachSkills = coachSkillRepository.findByCoachId(coachId);

        return coachSkills.stream()
                .map(cs -> new CoachSkillDTO(
                        cs.getSkill().getSkill_id(),
                        cs.getSkill().getTitle(),
                        cs.getSkillLevel()))
                .collect(Collectors.toList());
    }

    /**
     * Updates a specific skill level for a coach.
     * 
     * @param coachId    The ID of the coach
     * @param skillId    The ID of the skill
     * @param skillLevel The new skill level
     * @return Updated CoachSkillEntity
     */
    public CoachSkillEntity updateCoachSkillLevel(Integer coachId, Integer skillId, SkillLevel skillLevel) {
        CoachSkillEntity coachSkill = coachSkillRepository.findByCoachIdAndSkillId(coachId, skillId);

        if (coachSkill == null) {
            throw new EntityNotFoundException(
                    "Coach skill relationship not found for coach: " + coachId + " and skill: " + skillId);
        }

        coachSkill.setSkillLevel(skillLevel);
        return coachSkillRepository.save(coachSkill);
    }

    /**
     * Populates the skillsWithLevels transient field for a coach
     * 
     * @param coach The coach entity to populate
     */
    private void populateSkillsWithLevels(CoachEntity coach) {
        if (coach.getId() != null) {
            List<CoachSkillDTO> skillsWithLevels = getCoachSkills(coach.getId());
            coach.setSkillsWithLevels(skillsWithLevels);
        }
    }

    /**
     * Populates the skillsWithLevels transient field for a list of coaches
     * 
     * @param coaches The list of coach entities to populate
     */
    private void populateSkillsWithLevelsForList(List<CoachEntity> coaches) {
        for (CoachEntity coach : coaches) {
            populateSkillsWithLevels(coach);
        }
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
     * Retrieves all coaches from the database with their skill levels.(GET)
     *
     * @return List<CoachEntity> containing all coaches with skill levels
     */
    public List<CoachEntity> findAllCoaches() {
        List<CoachEntity> coaches = coachRepository.findAll();
        populateSkillsWithLevelsForList(coaches);
        return coaches;
    }

    /**
     * Retrieves all members associated with a specific coach.
     * 
     * @param coachId The unique identifier of the coach
     * @return List of MemberInfoEntity objects associated with the coach, or empty
     *         list if none found
     * @throws EntityNotFoundException if the coach with the given ID doesn't exist
     */
    public List<MemberInfoEntity> getCoachMembers(Integer id) {
        CoachEntity coach = coachRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Coach not found with id: " + id));

        // The members are already loaded via the @ManyToMany relationship
        // Just return the list from the entity
        return coach.getMembers();
    }

    // --------------------------------- Delete Coach ----------------------------//
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

        // Delete all coach-skill relationships first (cascade should handle this, but
        // being explicit)
        List<CoachSkillEntity> coachSkills = coachSkillRepository.findByCoachId(id);
        coachSkillRepository.deleteAll(coachSkills);

        // Delete the coach
        coachRepository.deleteById(id);
        return "Coach with ID: " + id + " has been successfully deleted";
    }

    // -----------------------Get Coach By Firebase ID---------------------//
    /**
     * Retrieves a coach by their Firebase ID with skill levels.(GET)
     *
     * @param firebaseID The Firebase ID of the coach to find
     * @return CoachEntity if found with skill levels populated
     * @throws EntityNotFoundException if coach not found
     */
    public CoachEntity findCoachByFirebaseID(String firebaseID) {
        CoachEntity coach = coachRepository.findByFirebaseID(firebaseID)
                .orElseThrow(() -> new EntityNotFoundException("Coach not found with Firebase ID: " + firebaseID));
        populateSkillsWithLevels(coach);
        return coach;
    }

    // ----------------------- Coach Skill Level Queries ---------------------//
    /**
     * Finds coaches by skill and minimum skill level.
     * 
     * @param skillId       The ID of the skill
     * @param minSkillLevel The minimum skill level required
     * @return List of CoachEntity objects that meet the criteria
     */
    public List<CoachEntity> findCoachesBySkillAndLevel(Integer skillId, SkillLevel minSkillLevel) {
        List<CoachSkillEntity> coachSkills = coachSkillRepository.findBySkillId(skillId);

        return coachSkills.stream()
                .filter(cs -> isSkillLevelAtLeast(cs.getSkillLevel(), minSkillLevel))
                .map(CoachSkillEntity::getCoach)
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Finds coaches by multiple skills and their respective minimum skill levels.
     * 
     * @param skillIds       List of skill IDs
     * @param minSkillLevels List of minimum skill levels (corresponding to
     *                       skillIds)
     * @return List of CoachEntity objects that meet all criteria
     */
    public List<CoachEntity> findCoachesByMultipleSkillsAndLevels(List<Integer> skillIds,
            List<SkillLevel> minSkillLevels) {
        if (skillIds.size() != minSkillLevels.size()) {
            throw new IllegalArgumentException("Skill IDs and skill levels lists must have the same size");
        }

        List<CoachEntity> qualifiedCoaches = new ArrayList<>();

        for (int i = 0; i < skillIds.size(); i++) {
            List<CoachEntity> coachesForSkill = findCoachesBySkillAndLevel(skillIds.get(i), minSkillLevels.get(i));

            if (i == 0) {
                qualifiedCoaches.addAll(coachesForSkill);
            } else {
                // Keep only coaches that appear in both lists (intersection)
                qualifiedCoaches.retainAll(coachesForSkill);
            }
        }

        return qualifiedCoaches;
    }

    /**
     * Helper method to check if a skill level meets the minimum requirement.
     * 
     * @param actualLevel The actual skill level
     * @param minLevel    The minimum required skill level
     * @return true if actualLevel >= minLevel
     */
    private boolean isSkillLevelAtLeast(SkillLevel actualLevel, SkillLevel minLevel) {
        int actualOrdinal = actualLevel.ordinal();
        int minOrdinal = minLevel.ordinal();
        return actualOrdinal >= minOrdinal;
    }

    /**
     * Gets coaches grouped by skill level for a specific skill.
     * 
     * @param skillId The ID of the skill
     * @return Map where key is SkillLevel and value is List of CoachEntity
     */
    public java.util.Map<SkillLevel, List<CoachEntity>> getCoachesGroupedBySkillLevel(Integer skillId) {
        List<CoachSkillEntity> coachSkills = coachSkillRepository.findBySkillId(skillId);

        return coachSkills.stream()
                .collect(Collectors.groupingBy(
                        CoachSkillEntity::getSkillLevel,
                        Collectors.mapping(CoachSkillEntity::getCoach, Collectors.toList())));
    }
}
