package com.universalathletics.modules.requests.connection.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

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
     * Autowired instance of ConnectionRequestService used for facilitating dataflow to service layer.
     */
    @Autowired
    private ConnectionRequestService connectionRequestService;

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
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
