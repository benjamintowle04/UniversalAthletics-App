package com.universalathletics.coach.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.*;

import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;

import com.universalathletics.coach.entity.*;
import com.universalathletics.coach.model.CoachSortDTO;
import com.universalathletics.coach.service.*;
import com.universalathletics.skill.entity.SkillEntity;

import ch.qos.logback.core.util.COWArrayList;

import java.net.*;
import java.io.*;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;


//------------------------ Coach Controller Class ----------------------//
/**
 * REST Controller for handling member information operations.
 * Provides endpoints for managing member data in the Universal Athletics
 * system.
 *
 * Responsibilities:
 * - Handle HTTP requests for member operations
 * - Delegate business logic to Coachervice
 * - Process and return appropriate responses
 */


 
@RestController
@RequestMapping("/api/coaches")
@CrossOrigin(origins = "*")
public class CoachController {

    /**
     * Autowired instance of Coachervice for handling business logic.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private CoachService coachervice;

    /**
     * Need to use for getting the image from the cloud storage
     */
    @Autowired
    private GoogleCloudStorageService storageService;

    /**
     * Instance of RestTemplate for making HTTP requests to OpenStreetMap API.
     */
    private static final RestTemplate restTemplate = new RestTemplate();



    // ------------------------- Create Member Endpoint --------------------------//
    /**
     * Creates a new member in the system.
     *
     * @param coach The member information to be saved
     * @return ResponseEntity<CoachEntity> with status 201 (CREATED) and the
     *         created member
     */
    @PostMapping
    public ResponseEntity<CoachEntity> createCoach(@RequestBody CoachEntity coach) {
        CoachEntity createdMember = coachervice.saveCoach(coach);
        return new ResponseEntity<>(createdMember, HttpStatus.CREATED);
    }

// -------------------------- Get All Members Endpoint -----------------------//
    /**
     * Retrieves all members from the system.
     *
     * @return ResponseEntity<List<CoachEntity>> with status 200 (OK) and list
     *         of all coaches in a specific order based on users skills and location
     */
    @PostMapping("/sort")
    public ResponseEntity<List<CoachEntity>> getAllCoaches(@RequestBody CoachSortDTO requestBody) throws IOException {
        try {
            System.out.println("Received skills: " + requestBody.getSkills());
            System.out.println("Received location: " + requestBody.getLocation());
            List<CoachEntity> coaches = coachervice.findAllCoaches();
            coaches = sortCoaches(coaches, requestBody.getSkills(), requestBody.getLocation());
            //coaches = updateCoachLocations(coaches);

            for (CoachEntity coach : coaches) {
                if (coach.getProfilePic() != null) {
                    try {
                        String signedUrl = storageService.getSignedFileUrl(coach.getProfilePic());
                        coach.setProfilePic(signedUrl);
                    } catch (Exception e) {
                        System.err.println("Error signing URL for coach " + coach.getId() + ": " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }
            return new ResponseEntity<>(coaches, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error in getAllCoaches: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    /**
     * Helper method to sort coaches based on skills and location
     * @param skills
     * @param location
     * @return List<CoachEntity> the sorted list of coaches that are the best fit for the user
     */
    public static List<CoachEntity> sortCoaches(List<CoachEntity> coaches, List<SkillEntity> skills, String location) {
        double latitude = parseLatitude(location);
        double longitude = parseLongitude(location);
    
        coaches.sort((coach1, coach2) -> {
            double score1 = calculateCompatibilityScore(coach1, skills, latitude, longitude);
            double score2 = calculateCompatibilityScore(coach2, skills, latitude, longitude);
            // Sort in descending order (highest score first)
            return Double.compare(score2, score1);
        });

        return coaches;

    }

    /**
     * Helper method to update each coaches location to a readable format (city, state, country)
     **/
     public static List<CoachEntity> updateCoachLocations(List<CoachEntity> coaches) {
        String formattedLocation; 
        double latitude;
        double longitude;
        List<CoachEntity> updatedCoaches = new ArrayList<>();
        CoachEntity currentCoach;
    
        for (CoachEntity coach : coaches) {
            latitude = parseLatitude(coach.getLocation());
            longitude = parseLongitude(coach.getLocation());
            formattedLocation = getCityStateFromCoordinates(latitude, longitude);
            currentCoach = new CoachEntity(coach.getFirstName(), coach.getLastName(), coach.getEmail(), coach.getPhone(), coach.getBiography1(), coach.getBiography2(), coach.getProfilePic(), coach.getBioPic1(), coach.getBioPic2(), formattedLocation, coach.getFirebaseID());
            updatedCoaches.add(currentCoach);
        }

        return updatedCoaches;
    }

    /**
     * Helper method to parse latitude from coordinate string
     * @param coordinateString String in format "Latitude: 42.02384529218001, Longitude: -93.64541386213286"
     * @return double the parsed latitude value
     */
    public static double parseLatitude(String coordinateString) {
        if (coordinateString == null || coordinateString.isEmpty()) {
            return 0.0;
        }
        
        try {
            // Extract the substring between "Latitude: " and the comma
            int startIndex = coordinateString.indexOf("Latitude: ") + "Latitude: ".length();
            int endIndex = coordinateString.indexOf(",", startIndex);
            
            if (startIndex < 0 || endIndex < 0) {
                System.err.println("Invalid coordinate string format for latitude: " + coordinateString);
                return 0.0;
            }
            
            String latitudeStr = coordinateString.substring(startIndex, endIndex).trim();
            double latitude = Double.parseDouble(latitudeStr);
            System.out.println("Parsed latitude: " + latitude);
            System.out.println("Rounded Latitude: " + Math.round(latitude * 100000.0) / 100000.0);
            
            // Round the latitude to 5 decimal places
            return Math.round(latitude * 100000.0) / 100000.0;
        } catch (Exception e) {
            System.err.println("Error parsing latitude from: " + coordinateString);
            e.printStackTrace();
            return 0.0;
        }
    }


    /**
     * Helper method to parse longitude from coordinate string
     * @param coordinateString String in format "Latitude: 42.02384529218001, Longitude: -93.64541386213286"
     * @return double the parsed longitude value
     */
    public static double parseLongitude(String coordinateString) {
        if (coordinateString == null || coordinateString.isEmpty()) {
            return 0.0;
        }
        
        try {
            // Extract the substring after "Longitude: "
            int startIndex = coordinateString.indexOf("Longitude: ") + "Longitude: ".length();
            
            if (startIndex < 0) {
                System.err.println("Invalid coordinate string format for longitude: " + coordinateString);
                return 0.0;
            }
            
            String longitudeStr = coordinateString.substring(startIndex).trim();
            double longitude = Double.parseDouble(longitudeStr);
           
            // Round the longitude to 5 decimal places
            return Math.round(longitude * 100000.0) / 100000.0;
        } catch (Exception e) {
            System.err.println("Error parsing longitude from: " + coordinateString);
            e.printStackTrace();
            return 0.0;
        }
    }

    /**
     * Helper method to convert the latitude and longitude to a city/state string using OpenStreetMap Nominatim API
     */
    public static String getCityStateFromCoordinates(double latitude, double longitude) {
        try {
            // Format the URL for the Nominatim API
            String url = String.format(
                "https://nominatim.openstreetmap.org/reverse?format=json&lat=%f&lon=%f&zoom=10",
                latitude, longitude
            );

            System.out.println("URL for openstreet API: " + url);
            
            // Set required headers - User-Agent is required by Nominatim's usage policy
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "UniversalAthleticsApp");
            
            // Make the request
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), Map.class
            );
            
            // Process the response
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("address")) {
                Map<String, String> address = (Map<String, String>) body.get("address");
                
                // Extract relevant location information
                String city = address.getOrDefault("city", 
                             address.getOrDefault("town",
                             address.getOrDefault("village", "Unknown")));
                             
                String state = address.getOrDefault("state", 
                              address.getOrDefault("county", ""));
                                
                // Format the location string
                if (!state.isEmpty()) {
                    return String.format("%s, %s", city, state);
                } else {
                    return city;
                }
            }
            
            return "Location not found";
        } catch (Exception e) {
            System.err.println("Error getting location from coordinates: " + e.getMessage());
            e.printStackTrace();
            return "Error retrieving location";
        }
    }

    /**
     * Helper method to calculate distance between two sets of coordinates using the Haversine formula
     * @param lat1
     * @param lon1
     * @param lat2
     * @param lon2
     * @return double the distance in kilometers
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; 
    }


    /**
     * Calculate how well a coach's skills match the requested skills
     * 
     * @param coach The coach to evaluate
     * @param requestedSkills The skills requested by the user
     * @return A score representing how well the coach's skills match the request
     */
    public static int calculateSkillMatchScore(CoachEntity coach, List<SkillEntity> requestedSkills) {
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
    public static double calculateCompatibilityScore(CoachEntity coach, List<SkillEntity> requestedSkills, 
        double userLatitude, double userLongitude) {
        // Constants for weighting factors
        final double DISTANCE_WEIGHT = 0.7;  // 70% weight for distance
        final double SKILLS_WEIGHT = 0.3;    // 30% weight for skills
        final double MAX_RELEVANT_DISTANCE = 300.0;  // km - distances beyond this are all equally bad

        // Calculate distance score (inverse - closer is better)
        double distance = 0.0;
        if (coach.getLocation() != null && !coach.getLocation().isEmpty()) {
            double coachLatitude = parseLatitude(coach.getLocation());
            double coachLongitude = parseLongitude(coach.getLocation());
            distance = calculateDistance(userLatitude, userLongitude, coachLatitude, coachLongitude);
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

}