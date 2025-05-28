package com.universalathletics.modules.coach.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.coach.model.CoachSortDTO;
import com.universalathletics.service.geocoding.GeocodingService;
import com.universalathletics.service.sorting.CoachSortingService;
import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.coach.service.CoachService;
import com.universalathletics.modules.memberInfo.controller.MemberInfoController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;



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
     * Logger instance for logging information and errors.
     * Using SLF4J for logging.
     */
    private static final Logger logger = LoggerFactory.getLogger(MemberInfoController.class);

    /**
     * Autowired instance of Coachervice for handling business logic.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private CoachService coachservice;

    /**
     * Need to use for getting the image from the cloud storage
     */
    @Autowired
    private GoogleCloudStorageService storageService;


    /**
     * Autowired instance of GeocodingService for handling geocoding operations.
     */
    @Autowired
    private GeocodingService geocodingService;

    /**
     * Autowired instance of CoachSortingService for handling sorting operations.
     */
    @Autowired
    private CoachSortingService coachSortingService;

    
    /**
     * Creates a new member in the system.
     *
     * @param coach The member information to be saved
     * @return ResponseEntity<CoachEntity> with status 201 (CREATED) and the
     *         created member
     */
    @PostMapping
    public ResponseEntity<CoachEntity> createCoach(@RequestBody CoachEntity coach) {
        CoachEntity createdMember = coachservice.saveCoach(coach);
        return new ResponseEntity<>(createdMember, HttpStatus.CREATED);
    }

    /**
     * Retrieves all members from the system.
     *
     * @return ResponseEntity<List<CoachEntity>> with status 200 (OK) and list
     *         of all coaches in a specific order based on users skills and location
     */
    @PostMapping("/sort")
    public ResponseEntity<List<CoachEntity>> getAllCoaches(@RequestBody CoachSortDTO requestBody) throws IOException {
        try {
            logger.info("Received request to get all coaches: " + requestBody);
            List<CoachEntity> coaches = coachservice.findAllCoaches();
            coaches = coachSortingService.sortCoaches(coaches, requestBody.getSkills(), requestBody.getLocation());

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
     * Retrieves a specific member by ID and converts coordinates to city, state format.
     *
     * @param firebaseID The Firebase ID of the member to be retrieved
     * @return ResponseEntity<CoachEntity> with status 200 (OK) and the member
     *         information with location converted to city, state format, or 404 (NOT FOUND) if not found
     */
    @GetMapping("/{firebaseID}")
    public ResponseEntity<CoachEntity> getCoachById(@PathVariable String firebaseID) {
        try {
            CoachEntity coach = coachservice.findCoachByFirebaseID(firebaseID);
            if (coach != null) {
                // Handle profile picture signing
                if (coach.getProfilePic() != null) {
                    try {
                        String signedUrl = storageService.getSignedFileUrl(coach.getProfilePic());
                        coach.setProfilePic(signedUrl);
                    } catch (Exception e) {
                        logger.error("Error signing URL for coach " + coach.getId() + ": " + e.getMessage(), e);
                    }
                }

                // Handle location conversion from coordinates to city, state
                if (coach.getLocation() != null && isCoordinateFormat(coach.getLocation())) {
                    try {
                        double latitude = geocodingService.parseLatitude(coach.getLocation());
                        double longitude = geocodingService.parseLongitude(coach.getLocation());
                        
                        if (latitude != 0.0 || longitude != 0.0) { // Check if parsing was successful
                            String cityStateLocation = geocodingService.getCityStateFromCoordinates(latitude, longitude);
                            if (cityStateLocation != null && !cityStateLocation.isEmpty() && 
                                !cityStateLocation.equals("Location not found") && 
                                !cityStateLocation.equals("Error retrieving location")) {
                                coach.setLocation(cityStateLocation);
                                logger.info("Successfully converted coordinates to: {}", cityStateLocation);
                            } else {
                                logger.warn("Could not convert coordinates to city, state for coach {}", coach.getId());
                            }
                        }
                    } catch (Exception e) {
                        logger.error("Error converting coordinates to city, state for coach " + coach.getId() + ": " + e.getMessage(), e);
                        // Keep original location if conversion fails
                    }
                }

                return new ResponseEntity<>(coach, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error retrieving coach with Firebase ID " + firebaseID + ": " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Helper method to check if location is in coordinate format
     * Checks for both "lat,lng" format and "Latitude: X, Longitude: Y" format
     * 
     * @param location The location string to check
     * @return true if location appears to be in coordinate format
     */
    private boolean isCoordinateFormat(String location) {
        if (location == null || location.trim().isEmpty()) {
            return false;
        }
        
        // Check for "Latitude: X, Longitude: Y" format (your existing format)
        if (location.contains("Latitude:") && location.contains("Longitude:")) {
            return true;
        }
        
        // Check for simple "lat,lng" format
        String[] parts = location.split(",");
        if (parts.length == 2) {
            try {
                double lat = Double.parseDouble(parts[0].trim());
                double lng = Double.parseDouble(parts[1].trim());
                
                // Basic validation for valid latitude and longitude ranges
                return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        
        return false;
    }
}
