package com.universalathletics.modules.requests.session.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.requests.session.service.SessionRequestService;
import com.universalathletics.modules.requests.session.model.SessionRequestDTO;

import java.util.List;

/**
 * REST Controller for handling session request operations.
 * Provides endpoints for managing session request data in the Universal Athletics
 * system.
 *
 * Responsibilities:
 * - Handle HTTP requests for session request operations
 * - Delegate business logic to SessionRequestService
 * - Process and return appropriate responses
 */
@RestController
@RequestMapping("/api/requests/sessions")
@CrossOrigin(origins = "*")
public class SessionRequestController {

    /**
     * Logger instance for logging information and errors.
     */
    private static final Logger logger = LoggerFactory.getLogger(SessionRequestController.class);

    /**
     * Autowired instance of SessionRequestService used for facilitating dataflow to service layer.
     */
    @Autowired
    private SessionRequestService sessionRequestService;

    /**
     * Autowired instance of GoogleCloudStorageService for handling profile picture signing.
     */
    @Autowired
    private GoogleCloudStorageService storageService;

    /**
     * Get all pending session requests where the recipient is a member with the specified ID.
     * 
     * @param memberId The ID of the member who is the recipient of the requests
     * @return ResponseEntity containing a list of pending session request DTOs for the member
     */
    @GetMapping("/pending/member/{memberId}")
    public ResponseEntity<List<SessionRequestDTO>> getPendingRequestsForMember(
            @PathVariable Integer memberId) {
        try {
            List<SessionRequestDTO> pendingRequests = 
                sessionRequestService.getPendingRequestsForMember(memberId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending session requests for member " + memberId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all pending session requests where the recipient is a coach with the specified ID.
     * 
     * @param coachId The ID of the coach who is the recipient of the requests
     * @return ResponseEntity containing a list of pending session request DTOs for the coach
     */
    @GetMapping("/pending/coach/{coachId}")
    public ResponseEntity<List<SessionRequestDTO>> getPendingRequestsForCoach(
            @PathVariable Integer coachId) {
        try {
            List<SessionRequestDTO> pendingRequests = 
                sessionRequestService.getPendingRequestsForCoach(coachId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending session requests for coach " + coachId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all pending session requests sent by a member with the specified ID.
     * 
     * @param memberId The ID of the member who sent the requests
     * @return ResponseEntity containing a list of pending session request DTOs sent by the member
     */
    @GetMapping("/pending/sent/member/{memberId}")
    public ResponseEntity<List<SessionRequestDTO>> getPendingRequestsSentByMember(
            @PathVariable Integer memberId) {
        try {
            List<SessionRequestDTO> pendingRequests = 
                sessionRequestService.getPendingRequestsSentByMember(memberId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending session requests sent by member " + memberId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all pending session requests sent by a coach with the specified ID.
     * 
     * @param coachId The ID of the coach who sent the requests
     * @return ResponseEntity containing a list of pending session request DTOs sent by the coach
     */
    @GetMapping("/pending/sent/coach/{coachId}")
    public ResponseEntity<List<SessionRequestDTO>> getPendingRequestsSentByCoach(
            @PathVariable Integer coachId) {
        try {
            List<SessionRequestDTO> pendingRequests = 
                sessionRequestService.getPendingRequestsSentByCoach(coachId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending session requests sent by coach " + coachId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new session request from a member to a coach.
     * 
     * @param sessionRequestDTO The session request data
     * @return ResponseEntity containing the created session request DTO
     */
    @PostMapping("/member-to-coach")
    public ResponseEntity<?> createMemberToCoachRequest(@RequestBody SessionRequestDTO sessionRequestDTO) {
        try {
            SessionRequestDTO createdRequest = 
                sessionRequestService.createMemberToCoachRequest(sessionRequestDTO);
            
            logger.info("Member-to-coach session request created with ID: {}", createdRequest.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request data for member-to-coach session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid request data: " + e.getMessage());
        } catch (IllegalStateException e) {
            logger.warn("Session request creation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating member-to-coach session request: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while creating the session request");
        }
    }

    /**
     * Create a new session request from a coach to a member.
     * 
     * @param sessionRequestDTO The session request data
     * @return ResponseEntity containing the created session request DTO
     */
    @PostMapping("/coach-to-member")
    public ResponseEntity<?> createCoachToMemberRequest(@RequestBody SessionRequestDTO sessionRequestDTO) {
        try {
            SessionRequestDTO createdRequest = 
                sessionRequestService.createCoachToMemberRequest(sessionRequestDTO);
            
            logger.info("Coach-to-member session request created with ID: {}", createdRequest.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request data for coach-to-member session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid request data: " + e.getMessage());
        } catch (IllegalStateException e) {
            logger.warn("Session request creation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating coach-to-member session request: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while creating the session request");
        }
    }

    /**
     * Accept a session request by updating its status to ACCEPTED.
     * 
     * @param requestId The ID of the session request to accept
     * @param receiverId The ID of the member accepting the request
     * @return ResponseEntity indicating success or failure
     */
    @PutMapping("/{requestId}/accept/{receiverId}")
    public ResponseEntity<String> acceptSessionRequest(
            @PathVariable Integer requestId,
            @PathVariable Integer receiverId) {
        try {
            boolean success = sessionRequestService.acceptSessionRequest(requestId, receiverId);
            
            if (success) {
                logger.info("Session request {} accepted by user {}", requestId, receiverId);
                return ResponseEntity.ok("Session request accepted successfully");
            } else {
                logger.warn("Failed to accept session request {} for user {}", requestId, receiverId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to accept session request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error accepting session request " + requestId + " for user " + receiverId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while accepting the session request");
        }
    }

    /**
     * Decline a session request by updating its status to REJECTED.
     * 
     * @param requestId The ID of the session request to decline
     * @param receiverId The ID of the member declining the request
     * @return ResponseEntity indicating success or failure
     */
    @PutMapping("/{requestId}/decline/{receiverId}")
    public ResponseEntity<String> declineSessionRequest(
            @PathVariable Integer requestId,
            @PathVariable Integer receiverId) {
        try {
            boolean success = sessionRequestService.declineSessionRequest(requestId, receiverId);
            
            if (success) {
                logger.info("Session request {} declined by user {}", requestId, receiverId);
                return ResponseEntity.ok("Session request declined successfully");
            } else {
                logger.warn("Failed to decline session request {} for user {}", requestId, receiverId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to decline session request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error declining session request " + requestId + " for user " + receiverId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while declining the session request");
        }
    }

    /**
     * Cancel a session request by updating its status to CANCELLED.
     * This endpoint allows the sender of a request to cancel it before it's been accepted or declined.
     * 
     * @param requestId The ID of the session request to cancel
     * @param senderId The ID of the user who originally sent the request
     * @return ResponseEntity indicating success or failure
     */
    @PutMapping("/{requestId}/cancel/{senderId}")
    public ResponseEntity<String> cancelSessionRequest(
            @PathVariable Integer requestId,
            @PathVariable Integer senderId) {
        try {
            boolean success = sessionRequestService.cancelSessionRequest(requestId, senderId);
            
            if (success) {
                logger.info("Session request {} cancelled by sender {}", requestId, senderId);
                return ResponseEntity.ok("Session request cancelled successfully");
            } else {
                logger.warn("Failed to cancel session request {} for sender {}", requestId, senderId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to cancel session request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error cancelling session request " + requestId + " for sender " + senderId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while cancelling the session request");
        }
    }

    /**
     * Helper method to sign profile picture URLs for a list of session requests.
     * 
     * @param requests List of session request DTOs to process
     */
    private void signProfilePictureUrls(List<SessionRequestDTO> requests) {
        for (SessionRequestDTO request : requests) {
            // Sign sender profile picture
            if (request.getSenderProfilePic() != null && !request.getSenderProfilePic().isEmpty()) {
                try {
                    String signedSenderUrl = storageService.getSignedFileUrl(request.getSenderProfilePic());
                    request.setSenderProfilePic(signedSenderUrl);
                } catch (Exception e) {
                    logger.error("Error signing sender profile picture URL for session request " + request.getId() + ": " + e.getMessage(), e);
                }
            }
            
            // Sign receiver profile picture
            if (request.getReceiverProfilePic() != null && !request.getReceiverProfilePic().isEmpty()) {
                try {
                    String signedReceiverUrl = storageService.getSignedFileUrl(request.getReceiverProfilePic());
                    request.setReceiverProfilePic(signedReceiverUrl);
                } catch (Exception e) {
                    logger.error("Error signing receiver profile picture URL for session request " + request.getId() + ": " + e.getMessage(), e);
                }
            }
        }
    }
}
