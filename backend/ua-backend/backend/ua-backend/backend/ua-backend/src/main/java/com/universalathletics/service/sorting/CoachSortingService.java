package com.universalathletics.service.sorting;

import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.service.geocoding.GeocodingService;
import com.universalathletics.modules.skill.entity.SkillEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class CoachSortingService {

    @Autowired
    private GeocodingService geocodingService;

    
    /**
     * Calculate how well a coach's skills match the requested skills
     * 
     * @param coach The coach to evaluate
     * @param requestedSkills The skills requested by the user
     * @return A score representing how well the coach's skills match the request
     */
    public int calculateSkillMatchScore(CoachEntity coach, List<SkillEntity> requestedSkills) {
        if (requestedSkills == null || requestedSkills.isEmpty() || coach.getSkills() == null) {
            return 0;
        }
        
        int matchCount = 0;
        for (SkillEntity requestedSkill : requestedSkills) {
            for (SkillEntity coachSkill : coach.getSkills()) {
                if (coachSkill.getSkill_id() == requestedSkill.getSkill_id()) {
                    matchCount++;
                    break;
                }
            }
        }
        
        return matchCount;
    }
    
    /**
     * Calculate overall compatibility score between a user and a coach
     * Distance is weighted more heavily than skill matches
     * 
     * @param coach The coach to evaluate
     * @param requestedSkills The skills requested by the user
     * @param userLatitude User's latitude
     * @param userLongitude User's longitude
     * @return A score representing overall compatibility (higher is better)
     */
    public double calculateCompatibilityScore(CoachEntity coach, List<SkillEntity> requestedSkills, 
        double userLatitude, double userLongitude) {
        // Constants for weighting factors
        final double DISTANCE_WEIGHT = 0.7;  // 70% weight for distance
        final double SKILLS_WEIGHT = 0.3;    // 30% weight for skills
        final double MAX_RELEVANT_DISTANCE = 300.0;  // km - distances beyond this are all equally bad

        // Calculate distance score (inverse - closer is better)
        double distance = 0.0;
        if (coach.getLocation() != null && !coach.getLocation().isEmpty()) {
            double coachLatitude = geocodingService.parseLatitude(coach.getLocation());
            double coachLongitude = geocodingService.parseLongitude(coach.getLocation());
            distance = geocodingService.calculateDistance(userLatitude, userLongitude, coachLatitude, coachLongitude);
        } else {
            // No location data - assign maximum distance
            distance = MAX_RELEVANT_DISTANCE;
        }

        // Convert distance to a 0-1 score (1 is best - closest)
        // Using an inverse relationship with a cap
        double distanceScore = Math.max(0, 1 - (distance / MAX_RELEVANT_DISTANCE));

        // Calculate skill match score
        int matchCount = calculateSkillMatchScore(coach, requestedSkills);

        // Convert skill matches to a 0-1 score
        double skillScore = Math.min(1.0, matchCount / 5.0);

        // Calculate weighted score
        double overallScore = (distanceScore * DISTANCE_WEIGHT) + (skillScore * SKILLS_WEIGHT);

        // For debugging
        System.out.println(String.format("Coach %s: distance=%.2fkm (score=%.2f), skills=%d (score=%.2f), overall=%.2f", 
        coach.getLastName(), distance, distanceScore, matchCount, skillScore, overallScore));

        return overallScore;
    }
    
    /**
     * Sort coaches based on skills and location relative to the user
     * @param skills
     * @param location
     * @return List<CoachEntity> the sorted list of coaches that are the best fit for the user
     */
    public List<CoachEntity> sortCoaches(List<CoachEntity> coaches, List<SkillEntity> skills, String location) {
        double latitude = geocodingService.parseLatitude(location);
        double longitude = geocodingService.parseLongitude(location);
    
        coaches.sort((coach1, coach2) -> {
            double score1 = calculateCompatibilityScore(coach1, skills, latitude, longitude);
            double score2 = calculateCompatibilityScore(coach2, skills, latitude, longitude);
            // Sort in descending order (highest score first)
            return Double.compare(score2, score1);
        });

        return coaches;

    }
}
