package com.universalathletics.modules.coach.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.coach.model.CoachSortDTO;
import com.universalathletics.service.geocoding.GeocodingService;
import com.universalathletics.service.sorting.CoachSortingService;
import org.springframework.http.MediaType;


import jakarta.persistence.EntityNotFoundException;

import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.coach.service.CoachService;
import com.universalathletics.modules.memberInfo.controller.MemberInfoController;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
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
     * Creates a new coach in the system.
     *
     * @param coach The coach information to be saved
     * @return ResponseEntity<CoachEntity> with status 201 (CREATED) and the
     *         created coach
     */
    @PostMapping
    public ResponseEntity<CoachEntity> createCoach(@RequestBody CoachEntity coach) {
        CoachEntity createdCoach = coachservice.saveCoach(coach);
        try {
            // Fetch the freshly saved coach so transient fields (skillsWithLevels) are populated
            CoachEntity fullCoach = coachservice.findCoachByFirebaseID(createdCoach.getFirebaseID());

            // Sign profile and bio picture URLs if present
            if (fullCoach.getProfilePic() != null) {
                try {
                    String signedUrl = storageService.getSignedFileUrl(fullCoach.getProfilePic());
                    fullCoach.setProfilePic(signedUrl);
                } catch (Exception e) {
                    logger.error("Error signing profile URL for created coach: {}", e.getMessage(), e);
                }
            }
            if (fullCoach.getBioPic1() != null) {
                try {
                    String signedUrl = storageService.getSignedFileUrl(fullCoach.getBioPic1());
                    fullCoach.setBioPic1(signedUrl);
                } catch (Exception e) {
                    logger.error("Error signing bioPic1 URL for created coach: {}", e.getMessage(), e);
                }
            }
            if (fullCoach.getBioPic2() != null) {
                try {
                    String signedUrl = storageService.getSignedFileUrl(fullCoach.getBioPic2());
                    fullCoach.setBioPic2(signedUrl);
                } catch (Exception e) {
                    logger.error("Error signing bioPic2 URL for created coach: {}", e.getMessage(), e);
                }
            }

            return new ResponseEntity<>(fullCoach, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.warn("Returning unsupplemented created coach due to: {}", e.getMessage());
            return new ResponseEntity<>(createdCoach, HttpStatus.CREATED);
        }
    }

    /**
     * Updates an existing coach's profile information.
     *
     * @param firebaseId The Firebase ID of the coach to update
     * @param coach The updated coach information
     * @return ResponseEntity<CoachEntity> with status 200 (OK) and the updated coach
     */
    @PutMapping(value = "/update/{firebaseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CoachEntity> updateCoach(
            @PathVariable String firebaseId,
            @RequestParam("coachInfoJson") String coachInfoJson,
            @RequestParam("skillsJson") String skillsJson,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic,
            @RequestParam(value = "bioPic1", required = false) MultipartFile bioPic1,
            @RequestParam(value = "bioPic2", required = false) MultipartFile bioPic2) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CoachEntity coachInfo = objectMapper.readValue(coachInfoJson, CoachEntity.class);
            // Parse skillsJson as needed for your skill structure

            // Handle profile picture upload
            if (profilePic != null && !profilePic.isEmpty()) {
                String imageUrl = storageService.uploadFile(profilePic, "profiles");
                coachInfo.setProfilePic(imageUrl);
            }
            if (bioPic1 != null && !bioPic1.isEmpty()) {
                String bioPic1Url = storageService.uploadFile(bioPic1, "profiles");
                coachInfo.setBioPic1(bioPic1Url);
            }
            if (bioPic2 != null && !bioPic2.isEmpty()) {
                String bioPic2Url = storageService.uploadFile(bioPic2, "profiles");
                coachInfo.setBioPic2(bioPic2Url);
            }

            coachInfo.setFirebaseID(firebaseId);

            CoachEntity updatedCoach = coachservice.updateCoach(coachInfo);
            return new ResponseEntity<>(updatedCoach, HttpStatus.OK);

        } catch (JsonProcessingException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
     * Retrieves a specific member by ID and converts coordinates to city, state
     * format.
     *
     * @param firebaseID The Firebase ID of the member to be retrieved
     * @return ResponseEntity<CoachEntity> with status 200 (OK) and the member
     *         information with location converted to city, state format, or 404
     *         (NOT FOUND) if not found
     */
    @GetMapping("/{firebaseID}")
    public ResponseEntity<CoachEntity> getCoachById(@PathVariable String firebaseID) {
        try {
            // removed noisy debug log
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

                if (coach.getBioPic1() != null) {
                    try {
                        String signedUrl = storageService.getSignedFileUrl(coach.getBioPic1());
                        coach.setBioPic1(signedUrl);
                    } catch (Exception e) {
                        logger.error("Error signing URL for coach " + coach.getId() + ": " + e.getMessage(), e);
                    }
                }

                if (coach.getBioPic2() != null) {
                    try {
                        String signedUrl = storageService.getSignedFileUrl(coach.getBioPic2());
                        coach.setBioPic2(signedUrl);
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
                            String cityStateLocation = geocodingService.getCityStateFromCoordinates(latitude,
                                    longitude);
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
                        logger.error("Error converting coordinates to city, state for coach " + coach.getId() + ": "
                                + e.getMessage(), e);
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

    /**
     * Endpoint to retrieve all members associated with a specific coach.
     * 
     * @param memberId The unique identifier of the member
     * @return ResponseEntity containing a list of members or appropriate error
     *         response
     */
    @GetMapping("/{coachId}/members")
    public ResponseEntity<List<MemberInfoEntity>> getCoachesMembers(@PathVariable Integer coachId) {
        try {
            List<MemberInfoEntity> members = coachservice.getCoachMembers(coachId);
            for (MemberInfoEntity member : members) {
                if (member.getProfilePic() != null) {
                    String signedUrl = storageService.getSignedFileUrl(member.getProfilePic());
                    member.setProfilePic(signedUrl);
                }
            }
            return ResponseEntity.ok(members);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Deletes a coach from the system by Firebase ID.
     *
     * @param firebaseID The Firebase ID of the coach to delete
     * @return ResponseEntity with status 204 (NO CONTENT) if successful,
     *         404 (NOT FOUND) if coach doesn't exist, or 500 (INTERNAL SERVER ERROR) on failure
     */
    @DeleteMapping("/{firebaseID}")
    public ResponseEntity<String> deleteCoach(@PathVariable String firebaseID) {
        try {
            logger.info("Delete request received for coach with Firebase ID: {}", firebaseID);
            
            // Find coach by Firebase ID first
            CoachEntity coach = coachservice.findCoachByFirebaseID(firebaseID);
            if (coach == null) {
                logger.warn("Coach not found with Firebase ID: {}", firebaseID);
                return new ResponseEntity<>("Coach not found with Firebase ID: " + firebaseID, HttpStatus.NOT_FOUND);
            }
            
            // Delete the coach using the ID
            String result = coachservice.deleteCoach(coach.getId());
            logger.info("Successfully deleted coach: {}", result);
            
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            logger.error("Coach not found: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error deleting coach with Firebase ID {}: {}", firebaseID, e.getMessage(), e);
            return new ResponseEntity<>("Error deleting coach: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
