package com.universalathletics.modules.session.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.session.entity.SessionEntity;
import com.universalathletics.modules.session.service.SessionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * REST Controller for handling session operations.
 * Provides endpoints for managing session data in the Universal Athletics
 * system.
 *
 * Responsibilities:
 * - Handle HTTP requests for session operations
 * - Delegate business logic to SessionService
 * - Process and return appropriate responses
 */

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    /**
     * Logger instance for logging information and errors.
     * Using SLF4J for logging.
     */
    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    /**
     * Autowired instance of SessionService for handling business logic.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private SessionService sessionService;

    /**
     * Need to use for getting the image from the cloud storage
     */
    @Autowired
    private GoogleCloudStorageService storageService;

    /**
     * Creates a new session in the system.
     *
     * @param session The session information to be saved
     * @return ResponseEntity<SessionEntity> with status 201 (CREATED) and the
     *         created session
     */
    @PostMapping
    public ResponseEntity<SessionEntity> createSession(@RequestBody SessionEntity session) {
        try {
            logger.info("Received request to create session: " + session);
            SessionEntity createdSession = sessionService.saveSession(session);
            return new ResponseEntity<>(createdSession, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating session: " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all sessions from the system.
     *
     * @return ResponseEntity<List<SessionEntity>> with status 200 (OK) and list
     *         of all sessions
     */
    @GetMapping
    public ResponseEntity<List<SessionEntity>> getAllSessions() {
        try {
            logger.info("Received request to get all sessions");
            List<SessionEntity> sessions = sessionService.findAllSessions();

            // Sign profile picture URLs for both coach and member
            for (SessionEntity session : sessions) {
                if (session.getCoachProfilePic() != null) {
                    try {
                        String signedCoachUrl = storageService.getSignedFileUrl(session.getCoachProfilePic());
                        session.setCoachProfilePic(signedCoachUrl);
                    } catch (Exception e) {
                        logger.error("Error signing coach profile URL for session " + session.getId() + ": " + e.getMessage(), e);
                    }
                }

                if (session.getMemberProfilePic() != null) {
                    try {
                        String signedMemberUrl = storageService.getSignedFileUrl(session.getMemberProfilePic());
                        session.setMemberProfilePic(signedMemberUrl);
                    } catch (Exception e) {
                        logger.error("Error signing member profile URL for session " + session.getId() + ": " + e.getMessage(), e);
                    }
                }
            }

            return new ResponseEntity<>(sessions, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving all sessions: " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves sessions by coach ID.
     *
     * @param coachId The ID of the coach
     * @return ResponseEntity<List<SessionEntity>> with status 200 (OK) and list
     *         of sessions for the coach
     */
    @GetMapping("/coach/{coachId}")
    public ResponseEntity<List<SessionEntity>> getSessionsByCoachId(@PathVariable Integer coachId) {
        try {
            logger.info("Received request to get sessions by coach ID: " + coachId);
            List<SessionEntity> sessions = sessionService.findSessionsByCoachId(coachId);

            // Sign profile picture URLs for both coach and member
            for (SessionEntity session : sessions) {
                if (session.getCoachProfilePic() != null) {
                    try {
                        String signedCoachUrl = storageService.getSignedFileUrl(session.getCoachProfilePic());
                        session.setCoachProfilePic(signedCoachUrl);
                    } catch (Exception e) {
                        logger.error("Error signing coach profile URL for session " + session.getId() + ": " + e.getMessage(), e);
                    }
                }

                if (session.getMemberProfilePic() != null) {
                    try {
                        String signedMemberUrl = storageService.getSignedFileUrl(session.getMemberProfilePic());
                        session.setMemberProfilePic(signedMemberUrl);
                    } catch (Exception e) {
                        logger.error("Error signing member profile URL for session " + session.getId() + ": " + e.getMessage(), e);
                    }
                }
            }

            return new ResponseEntity<>(sessions, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving sessions for coach " + coachId + ": " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves sessions by member ID.
     *
     * @param memberId The ID of the member
     * @return ResponseEntity<List<SessionEntity>> with status 200 (OK) and list
     *         of sessions for the member
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<SessionEntity>> getSessionsByMemberId(@PathVariable Integer memberId) {
        try {
            logger.info("Received request to get sessions by member ID: " + memberId);
            List<SessionEntity> sessions = sessionService.findSessionsByMemberId(memberId);

            // Sign profile picture URLs for both coach and member
            for (SessionEntity session : sessions) {
                if (session.getCoachProfilePic() != null) {
                    try {
                        String signedCoachUrl = storageService.getSignedFileUrl(session.getCoachProfilePic());
                        session.setCoachProfilePic(signedCoachUrl);
                    } catch (Exception e) {
                        logger.error("Error signing coach profile URL for session " + session.getId() + ": " + e.getMessage(), e);
                    }
                }

                if (session.getMemberProfilePic() != null) {
                    try {
                        String signedMemberUrl = storageService.getSignedFileUrl(session.getMemberProfilePic());
                        session.setMemberProfilePic(signedMemberUrl);
                    } catch (Exception e) {
                        logger.error("Error signing member profile URL for session " + session.getId() + ": " + e.getMessage(), e);
                    }
                }
            }

            return new ResponseEntity<>(sessions, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving sessions for member " + memberId + ": " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Updates an existing session.
     *
     * @param sessionId The ID of the session to update
     * @param session The updated session information
     * @return ResponseEntity<SessionEntity> with status 200 (OK) and the updated session,
     *         or 404 (NOT FOUND) if session doesn't exist
     */
    @PutMapping("/{sessionId}")
    public ResponseEntity<SessionEntity> updateSession(@PathVariable Integer sessionId, @RequestBody SessionEntity session) {
        try {
            logger.info("Received request to update session with ID: " + sessionId);
            session.setId(sessionId);
            SessionEntity updatedSession = sessionService.updateSession(session);
            
            if (updatedSession != null) {
                return new ResponseEntity<>(updatedSession, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error updating session with ID " + sessionId + ": " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a session by ID.
     *
     * @param sessionId The ID of the session to delete
     * @return ResponseEntity with status 204 (NO CONTENT) if successful,
     *         or 404 (NOT FOUND) if session doesn't exist
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Integer sessionId) {
        try {
            logger.info("Received request to delete session with ID: " + sessionId);
            boolean deleted = sessionService.deleteSession(sessionId);
            
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error deleting session with ID " + sessionId + ": " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
