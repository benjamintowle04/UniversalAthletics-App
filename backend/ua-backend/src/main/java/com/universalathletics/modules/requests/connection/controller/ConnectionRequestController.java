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
@CrossOrigin(origins = "*")
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
            for (ConnectionRequestDTO request : pendingRequests) {
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
            
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            logger.error("Error retrieving pending requests for member " + memberId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
                logger.info("Connection request {} accepted by member {}", requestId, receiverId);
                return ResponseEntity.ok("Connection request accepted successfully");
            } else {
                logger.warn("Failed to accept connection request {} for member {}", requestId, receiverId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to accept connection request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error accepting connection request " + requestId + " for member " + receiverId + ": " + e.getMessage(), e);
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
                logger.info("Connection request {} declined by member {}", requestId, receiverId);
                return ResponseEntity.ok("Connection request declined successfully");
            } else {
                logger.warn("Failed to decline connection request {} for member {}", requestId, receiverId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to decline connection request. Request may not exist, may not belong to you, or may not be pending.");
            }
        } catch (Exception e) {
            logger.error("Error declining connection request " + requestId + " for member " + receiverId + ": " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while declining the connection request");
        }
    }
}
