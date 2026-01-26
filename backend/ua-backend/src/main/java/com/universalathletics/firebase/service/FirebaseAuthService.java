package com.universalathletics.firebase.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Service for managing Firebase Authentication operations.
 * Handles user deletion and other Firebase Auth admin tasks.
 */
@Service
public class FirebaseAuthService {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseAuthService.class);

    /**
     * Initialize Firebase Admin SDK with credentials from environment variable.
     * This runs once when the application starts.
     */
    @PostConstruct
    public void initialize() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                // Get Firebase credentials from environment variable
                String firebaseCredentials = System.getenv("FIREBASE_SERVICE_ACCOUNT");
                
                if (firebaseCredentials == null || firebaseCredentials.isEmpty()) {
                    logger.warn("FIREBASE_SERVICE_ACCOUNT environment variable not set. Firebase Auth operations will not be available.");
                    return;
                }

                // Parse credentials and initialize Firebase
                GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new ByteArrayInputStream(firebaseCredentials.getBytes(StandardCharsets.UTF_8))
                );

                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase Admin SDK initialized successfully");
            } catch (IOException e) {
                logger.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage(), e);
            }
        }
    }

    /**
     * Delete a user from Firebase Authentication by their UID.
     *
     * @param uid The Firebase UID of the user to delete
     * @return true if deletion was successful, false otherwise
     * @throws FirebaseAuthException if Firebase operation fails
     */
    public boolean deleteUser(String uid) throws FirebaseAuthException {
        if (FirebaseApp.getApps().isEmpty()) {
            logger.error("Firebase Admin SDK not initialized. Cannot delete user.");
            return false;
        }

        try {
            FirebaseAuth.getInstance().deleteUser(uid);
            logger.info("Successfully deleted Firebase user with UID: {}", uid);
            return true;
        } catch (FirebaseAuthException e) {
            logger.error("Failed to delete Firebase user with UID {}: {}", uid, e.getMessage());
            throw e;
        }
    }

    /**
     * Check if a user exists in Firebase Authentication.
     *
     * @param uid The Firebase UID to check
     * @return true if user exists, false otherwise
     */
    public boolean userExists(String uid) {
        if (FirebaseApp.getApps().isEmpty()) {
            logger.error("Firebase Admin SDK not initialized. Cannot check user existence.");
            return false;
        }

        try {
            FirebaseAuth.getInstance().getUser(uid);
            return true;
        } catch (FirebaseAuthException e) {
            logger.debug("User does not exist or error checking: {}", e.getMessage());
            return false;
        }
    }
}
