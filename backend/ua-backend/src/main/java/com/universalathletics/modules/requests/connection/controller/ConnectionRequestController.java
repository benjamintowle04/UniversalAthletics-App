package com.universalathletics.modules.requests.connection.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.requests.connection.model.ConnectionRequestDTO;
import com.universalathletics.modules.requests.connection.service.ConnectionRequestService;

import java.util.List;

/**
 * REST Controller for handling connection request operations.
 * Provides endpoints for managing connection request data in the Universal Athletics
 * system.
 *
 * Responsibilities:
 * - Handle HTTP requests for connection request operations
 * - Delegate business logic to ConnectionRequestService
 * - Process and return appropriate responses
 */
@RestController
@RequestMapping("/api/requests/connections")
public class ConnectionRequestController {

    /**
     * Logger instance for logging information and errors.
     */
    private static final Logger logger = LoggerFactory.getLogger(ConnectionRequestController.class);

    /**
     * Autowired instance of ConnectionRequestService used for facilitating dataflow to service layer.
     */
    @Autowired
    private ConnectionRequestService connectionRequestService;

    /**
     * Autowired instance of GoogleCloudStorageService for handling profile picture signing.
     */
    @Autowired
    private GoogleCloudStorageService storageService;

    /**
     * Get all pending connection requests where the recipient is a member with the specified ID.
     * 
     * @param memberId The ID of the member who is the recipient of the requests
     * @return ResponseEntity containing a list of pending connection request DTOs for the member
     */
    @GetMapping("/pending/member/{memberId}")
    public ResponseEntity<List<ConnectionRequestDTO>> getPendingRequestsForMember(
            @PathVariable Integer memberId) {
        try {
            List<ConnectionRequestDTO> pendingRequests = 
                connectionRequestService.getPendingRequestsForMember(memberId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending requests for member " + memberId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all pending connection requests where the recipient is a coach with the specified ID.
     * 
     * @param coachId The ID of the coach who is the recipient of the requests
     * @return ResponseEntity containing a list of pending connection request DTOs for the coach
     */
    @GetMapping("/pending/coach/{coachId}")
    public ResponseEntity<List<ConnectionRequestDTO>> getPendingRequestsForCoach(
            @PathVariable Integer coachId) {
        try {
            List<ConnectionRequestDTO> pendingRequests = 
                connectionRequestService.getPendingRequestsForCoach(coachId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending requests for coach " + coachId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all pending connection requests sent by a member with the specified ID.
     * 
     * @param memberId The ID of the member who sent the requests
     * @return ResponseEntity containing a list of pending connection request DTOs sent by the member
     */
    @GetMapping("/pending/sent/member/{memberId}")
    public ResponseEntity<List<ConnectionRequestDTO>> getPendingRequestsSentByMember(
            @PathVariable Integer memberId) {
        try {
            List<ConnectionRequestDTO> pendingRequests = 
                connectionRequestService.getPendingRequestsSentByMember(memberId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending requests sent by member " + memberId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all pending connection requests sent by a coach with the specified ID.
     * 
     * @param coachId The ID of the coach who sent the requests
     * @return ResponseEntity containing a list of pending connection request DTOs sent by the coach
     */
    @GetMapping("/pending/sent/coach/{coachId}")
    public ResponseEntity<List<ConnectionRequestDTO>> getPendingRequestsSentByCoach(
            @PathVariable Integer coachId) {
        try {
            List<ConnectionRequestDTO> pendingRequests = 
                connectionRequestService.getPendingRequestsSentByCoach(coachId);
            
            // Sign URLs for profile pictures
            signProfilePictureUrls(pendingRequests);
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending requests sent by coach " + coachId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new connection request from a member to a coach.
     * 
     * @param connectionRequestDTO The connection request data
     * @return ResponseEntity containing the created connection request DTO
     */
    @PostMapping("/member-to-coach")
    public ResponseEntity<?> createMemberToCoachRequest(@RequestBody ConnectionRequestDTO connectionRequestDTO) {
        try {
            ConnectionRequestDTO createdRequest = 
                connectionRequestService.createMemberToCoachRequest(connectionRequestDTO);
            
            logger.info("Member-to-coach connection request created with ID: {}", createdRequest.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request data for member-to-coach connection: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid request data: " + e.getMessage());
        } catch (IllegalStateException e) {
            logger.warn("Connection request creation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating member-to-coach connection request: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while creating the connection request");
        }
    }

    /**
     * Create a new connection request from a coach to a member.
     * 
     * @param connectionRequestDTO The connection request data
     * @return ResponseEntity containing the created connection request DTO
     */
    @PostMapping("/coach-to-member")
    public ResponseEntity<?> createCoachToMemberRequest(@RequestBody ConnectionRequestDTO connectionRequestDTO) {
        try {
            ConnectionRequestDTO createdRequest = 
                connectionRequestService.createCoachToMemberRequest(connectionRequestDTO);
            
            logger.info("Coach-to-member connection request created with ID: {}", createdRequest.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request data for coach-to-member connection: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid request data: " + e.getMessage());
        } catch (IllegalStateException e) {
            logger.warn("Connection request creation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating coach-to-member connection request: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while creating the connection request");
        }
    }

    /**
     * Accept a connection request by updating its status to ACCEPTED.
     * 
     * @param requestId The ID of the connection request to accept
     * @param receiverId The ID of the member accepting the request
     * @return ResponseEntity indicating success or failure
     */
    @PutMapping("/{requestId}/accept/{receiverId}")
    public ResponseEntity<String> acceptConnectionRequest(
            @PathVariable Integer requestId,
            @PathVariable Integer receiverId) {
        try {
            boolean success = connectionRequestService.acceptConnectionRequest(requestId, receiverId);
            
            if (success) {
                logger.info("Connection request {} accepted by user {}", requestId, receiverId);
                return ResponseEntity.ok("Connection request accepted successfully");
            } else {
                logger.warn("Failed to accept connection request {} for user {}", requestId, receiverId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to accept connection request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error accepting connection request " + requestId + " for user " + receiverId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while accepting the connection request");
        }
    }

    /**
     * Decline a connection request by updating its status to REJECTED.
     * 
     * @param requestId The ID of the connection request to decline
     * @param receiverId The ID of the member declining the request
     * @return ResponseEntity indicating success or failure
     */
    @PutMapping("/{requestId}/decline/{receiverId}")
    public ResponseEntity<String> declineConnectionRequest(
            @PathVariable Integer requestId,
            @PathVariable Integer receiverId) {
        try {
            boolean success = connectionRequestService.declineConnectionRequest(requestId, receiverId);
            
            if (success) {
                logger.info("Connection request {} declined by user {}", requestId, receiverId);
                return ResponseEntity.ok("Connection request declined successfully");
            } else {
                logger.warn("Failed to decline connection request {} for user {}", requestId, receiverId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to decline connection request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error declining connection request " + requestId + " for user " + receiverId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while declining the connection request");
        }
    }

    /**
     * Cancel a connection request by updating its status to CANCELLED.
     * This endpoint allows the sender of a request to cancel it before it's been accepted or declined.
     * 
     * @param requestId The ID of the connection request to cancel
     * @param senderId The ID of the user who originally sent the request
     * @return ResponseEntity indicating success or failure
     */
    @PutMapping("/{requestId}/cancel/{senderId}")
    public ResponseEntity<String> cancelConnectionRequest(
            @PathVariable Integer requestId,
            @PathVariable Integer senderId) {
        try {
            boolean success = connectionRequestService.cancelConnectionRequest(requestId, senderId);
            
            if (success) {
                logger.info("Connection request {} cancelled by sender {}", requestId, senderId);
                return ResponseEntity.ok("Connection request cancelled successfully");
            } else {
                logger.warn("Failed to cancel connection request {} for sender {}", requestId, senderId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to cancel connection request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error cancelling connection request " + requestId + " for sender " + senderId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while cancelling the connection request");
        }
    }

    /**
     * Helper method to sign profile picture URLs for a list of connection requests.
     * 
     * @param requests List of connection request DTOs to process
     */
    private void signProfilePictureUrls(List<ConnectionRequestDTO> requests) {
        for (ConnectionRequestDTO request : requests) {
            // Sign sender profile picture
            if (request.getSenderProfilePic() != null && !request.getSenderProfilePic().isEmpty()) {
                try {
                    String signedSenderUrl = storageService.getSignedFileUrl(request.getSenderProfilePic());
                    request.setSenderProfilePic(signedSenderUrl);
                } catch (Exception e) {
                    logger.error("Error signing sender profile picture URL for request " + request.getId() + ": " + e.getMessage(), e);
                }
            }
            
            // Sign receiver profile picture
            if (request.getReceiverProfilePic() != null && !request.getReceiverProfilePic().isEmpty()) {
                try {
                    String signedReceiverUrl = storageService.getSignedFileUrl(request.getReceiverProfilePic());
                    request.setReceiverProfilePic(signedReceiverUrl);
                } catch (Exception e) {
                    logger.error("Error signing receiver profile picture URL for request " + request.getId() + ": " + e.getMessage(), e);
                }
            }
        }
    }
}
