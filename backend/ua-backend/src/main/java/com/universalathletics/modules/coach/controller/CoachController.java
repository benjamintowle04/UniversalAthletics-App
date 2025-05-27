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
     * Retrieves a specific member by ID.
     *
     * @param id The Firebase ID of the member to be retrieved
     * @return ResponseEntity<CoachEntity> with status 200 (OK) and the member
     *         information, or 404 (NOT FOUND) if not found
     */
    @GetMapping("/{firebaseID}")
    public ResponseEntity<CoachEntity> getCoachById(@PathVariable String firebaseID) {
        CoachEntity coach = coachservice.findCoachByFirebaseID(firebaseID);
        if (coach != null) {
            if (coach.getProfilePic() != null) {
                try {
                    String signedUrl = storageService.getSignedFileUrl(coach.getProfilePic());
                    coach.setProfilePic(signedUrl);
                } catch (Exception e) {
                    System.err.println("Error signing URL for coach " + coach.getId() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }

            return new ResponseEntity<>(coach, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}