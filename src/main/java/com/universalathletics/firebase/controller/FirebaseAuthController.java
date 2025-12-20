package com.universalathletics.firebase.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.universalathletics.firebase.service.FirebaseAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST Controller for Firebase Authentication operations.
 * Provides endpoints for managing Firebase Auth users.
 */
@RestController
@RequestMapping("/api/firebase/auth")
public class FirebaseAuthController {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseAuthController.class);

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    /**
     * Delete a user from Firebase Authentication.
     *
     * @param uid The Firebase UID of the user to delete
     * @return ResponseEntity with status 200 (OK) if successful,
     *         404 (NOT FOUND) if user doesn't exist, or 500 (INTERNAL SERVER ERROR) on failure
     */
    @PostMapping("/delete/{uid}")
    public ResponseEntity<String> deleteUser(@PathVariable String uid) {
        try {
            logger.info("Delete request received for Firebase user with UID: {}", uid);
            
            boolean deleted = firebaseAuthService.deleteUser(uid);
            
            if (deleted) {
                return new ResponseEntity<>("Firebase user deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed to delete Firebase user. SDK may not be initialized.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (FirebaseAuthException e) {
            if (e.getAuthErrorCode().name().equals("USER_NOT_FOUND")) {
                logger.warn("Firebase user not found with UID: {}", uid);
                return new ResponseEntity<>("Firebase user not found", HttpStatus.NOT_FOUND);
            }
            logger.error("Error deleting Firebase user with UID {}: {}", uid, e.getMessage(), e);
            return new ResponseEntity<>("Error deleting Firebase user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            logger.error("Unexpected error deleting Firebase user with UID {}: {}", uid, e.getMessage(), e);
            return new ResponseEntity<>("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
