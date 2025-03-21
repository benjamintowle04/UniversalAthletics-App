package com.universalathletics.coach.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;

import com.universalathletics.coach.entity.*;
import com.universalathletics.coach.service.*;

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
@RequestMapping("/api/coach")
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
     *         of all members
     */
    @GetMapping
    public ResponseEntity<List<CoachEntity>> getAllCoaches() throws IOException {
        List<CoachEntity> coaches = coachervice.findAllCoaches();
        for (CoachEntity coach : coaches) {
            // Get fresh signed URL for the profile picture
            if (coach.getProfilePic() != null) {
                String signedUrl = storageService.getSignedFileUrl(coach.getProfilePic());
                coach.setProfilePic(signedUrl);
            }
        }
        return new ResponseEntity<>(coaches, HttpStatus.OK);
    }

}