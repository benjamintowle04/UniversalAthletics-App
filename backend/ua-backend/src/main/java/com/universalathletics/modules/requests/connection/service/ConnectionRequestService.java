package com.universalathletics.modules.requests.connection.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.universalathletics.modules.requests.connection.entity.ConnectionRequestEntity;
import com.universalathletics.modules.requests.connection.model.ConnectionRequestDTO;
import com.universalathletics.modules.requests.connection.repository.ConnectionRequestRepository;
import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;
import com.universalathletics.modules.jct.memberCoach.entity.MemberCoachEntity;
import com.universalathletics.modules.jct.memberCoach.repository.MemberCoachRepository;

/**
 * Service class for routing connection request operations. 
 */
@Service
public class ConnectionRequestService {
    
    @Autowired
    private ConnectionRequestRepository connectionRequestRepository;
    
    @Autowired
    private MemberCoachRepository memberCoachRepository;
    
    /**
     * Get all pending connection requests where the recipient is a member with the specified ID.
     * 
     * @param memberId The ID of the member who is the recipient
     * @return List of pending connection requests DTOs for the member
     */
    public List<ConnectionRequestDTO> getPendingRequestsForMember(Integer memberId) {
        List<ConnectionRequestEntity> entities = connectionRequestRepository.findByStatusAndReceiverTypeAndReceiverId(
            RequestStatus.PENDING, 
            UserType.MEMBER, 
            memberId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Accept a connection request by updating its status to ACCEPTED and creating the member-coach relationship.
     * 
     * @param requestId The ID of the connection request to accept
     * @param receiverId The ID of the receiver (to verify ownership)
     * @return true if the request was successfully accepted, false otherwise
     */
    @Transactional
    public boolean acceptConnectionRequest(Integer requestId, Integer receiverId) {
        // Verify the request exists and belongs to the receiver
        Optional<ConnectionRequestEntity> requestOpt = connectionRequestRepository.findByIdAndReceiverId(requestId, receiverId);
        
        if (requestOpt.isPresent()) {
            ConnectionRequestEntity request = requestOpt.get();
            
            // Only allow accepting if the current status is PENDING
            if (request.getStatus() == RequestStatus.PENDING) {
                try {
                    // Update the request status
                    int rowsUpdated = connectionRequestRepository.updateStatusById(requestId, RequestStatus.ACCEPTED);
                    
                    if (rowsUpdated > 0) {
                        // Create the member-coach relationship
                        createMemberCoachRelationship(request);
                        return true;
                    }
                } catch (Exception e) {
                    // Log the error and let the transaction roll back
                    throw new RuntimeException("Failed to accept connection request and create member-coach relationship", e);
                }
            }
        }
        
        return false;
    }
    
    /**
     * Decline a connection request by updating its status to REJECTED.
     * 
     * @param requestId The ID of the connection request to decline
     * @param receiverId The ID of the receiver (to verify ownership)
     * @return true if the request was successfully declined, false otherwise
     */
    public boolean declineConnectionRequest(Integer requestId, Integer receiverId) {
        // Verify the request exists and belongs to the receiver
        Optional<ConnectionRequestEntity> requestOpt = connectionRequestRepository.findByIdAndReceiverId(requestId, receiverId);
        
        if (requestOpt.isPresent()) {
            ConnectionRequestEntity request = requestOpt.get();
            
            // Only allow declining if the current status is PENDING
            if (request.getStatus() == RequestStatus.PENDING) {
                int rowsUpdated = connectionRequestRepository.updateStatusById(requestId, RequestStatus.REJECTED);
                return rowsUpdated > 0;
            }
        }
        
        return false;
    }
    
    /**
     * Create a member-coach relationship based on the connection request.
     * 
     * @param request The accepted connection request
     */
    private void createMemberCoachRelationship(ConnectionRequestEntity request) {
        Integer memberId = null;
        Integer coachId = null;
        
        // Determine which is the member and which is the coach
        if (request.getSenderType() == UserType.COACH && request.getReceiverType() == UserType.MEMBER) {
            // Coach sent request to Member
            coachId = request.getSenderId();
            memberId = request.getReceiverId();
        } else if (request.getSenderType() == UserType.MEMBER && request.getReceiverType() == UserType.COACH) {
            // Member sent request to Coach
            memberId = request.getSenderId();
            coachId = request.getReceiverId();
        } else {
            // This shouldn't happen based on your current setup, but handle it gracefully
            throw new IllegalArgumentException("Invalid connection request: both parties must be different types (MEMBER and COACH)");
        }
        
        // Check if the relationship already exists to avoid duplicates
        if (!memberCoachRepository.existsByMemberIdAndCoachId(memberId, coachId)) {
            MemberCoachEntity memberCoach = new MemberCoachEntity(memberId, coachId);
            memberCoachRepository.save(memberCoach);
        }
    }
    
    /**
     * Convert ConnectionRequestEntity to ConnectionRequestDTO
     * 
     * @param entity The entity to convert
     * @return The converted DTO
     */
    private ConnectionRequestDTO convertToDto(ConnectionRequestEntity entity) {
        ConnectionRequestDTO dto = new ConnectionRequestDTO();
        dto.setId(entity.getId());
        dto.setSenderType(entity.getSenderType());
        dto.setSenderId(entity.getSenderId());
        dto.setSenderFirebaseId(entity.getSenderFirebaseId());
        dto.setReceiverType(entity.getReceiverType());
        dto.setReceiverId(entity.getReceiverId());
        dto.setRecieverFirebaseId(entity.getReceiverFirebaseId());
        dto.setSenderFirstName(entity.getSenderFirstName());
        dto.setSenderLastName(entity.getSenderLastName());
        dto.setSenderProfilePic(entity.getSenderProfilePic());
        dto.setReceiverFirstName(entity.getReceiverFirstName());
        dto.setReceiverLastName(entity.getReceiverLastName());
        dto.setReceiverProfilePic(entity.getReceiverProfilePic());
        dto.setMessage(entity.getMessage());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
    
    /**
     * Convert ConnectionRequestDTO to ConnectionRequestEntity (for create/update operations)
     * 
     * @param dto The DTO to convert
     * @return The converted entity
     */
    private ConnectionRequestEntity convertToEntity(ConnectionRequestDTO dto) {
        ConnectionRequestEntity entity = new ConnectionRequestEntity();
        entity.setId(dto.getId());
        entity.setSenderType(dto.getSenderType());
        entity.setSenderId(dto.getSenderId());
        entity.setReceiverType(dto.getReceiverType());
        entity.setReceiverId(dto.getReceiverId());
        entity.setMessage(dto.getMessage());
        entity.setStatus(dto.getStatus());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }
}
