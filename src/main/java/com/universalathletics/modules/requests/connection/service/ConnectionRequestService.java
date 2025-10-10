package com.universalathletics.modules.requests.connection.service;

import java.time.LocalDateTime;
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
     * Get all pending connection requests where the recipient is a coach with the specified ID.
     * 
     * @param coachId The ID of the coach who is the recipient
     * @return List of pending connection requests DTOs for the coach
     */
    public List<ConnectionRequestDTO> getPendingRequestsForCoach(Integer coachId) {
        List<ConnectionRequestEntity> entities = connectionRequestRepository.findByStatusAndReceiverTypeAndReceiverId(
            RequestStatus.PENDING, 
            UserType.COACH, 
            coachId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all pending connection requests sent by a member with the specified ID.
     * 
     * @param memberId The ID of the member who sent the requests
     * @return List of pending connection requests DTOs sent by the member
     */
    public List<ConnectionRequestDTO> getPendingRequestsSentByMember(Integer memberId) {
        List<ConnectionRequestEntity> entities = connectionRequestRepository.findByStatusAndSenderTypeAndSenderId(
            RequestStatus.PENDING, 
            UserType.MEMBER, 
            memberId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all pending connection requests sent by a coach with the specified ID.
     * 
     * @param coachId The ID of the coach who sent the requests
     * @return List of pending connection requests DTOs sent by the coach
     */
    public List<ConnectionRequestDTO> getPendingRequestsSentByCoach(Integer coachId) {
        List<ConnectionRequestEntity> entities = connectionRequestRepository.findByStatusAndSenderTypeAndSenderId(
            RequestStatus.PENDING, 
            UserType.COACH, 
            coachId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Create a new connection request from a member to a coach.
     * 
     * @param connectionRequestDTO The connection request data
     * @return The created connection request DTO, or null if creation failed
     */
    @Transactional
    public ConnectionRequestDTO createMemberToCoachRequest(ConnectionRequestDTO connectionRequestDTO) {
        // Validate that sender is MEMBER and receiver is COACH
        if (connectionRequestDTO.getSenderType() != UserType.MEMBER || 
            connectionRequestDTO.getReceiverType() != UserType.COACH) {
            throw new IllegalArgumentException("Invalid user types for member-to-coach request");
        }
        
        return createConnectionRequest(connectionRequestDTO);
    }
    
    /**
     * Create a new connection request from a coach to a member.
     * 
     * @param connectionRequestDTO The connection request data
     * @return The created connection request DTO, or null if creation failed
     */
    @Transactional
    public ConnectionRequestDTO createCoachToMemberRequest(ConnectionRequestDTO connectionRequestDTO) {
        // Validate that sender is COACH and receiver is MEMBER
        if (connectionRequestDTO.getSenderType() != UserType.COACH || 
            connectionRequestDTO.getReceiverType() != UserType.MEMBER) {
            throw new IllegalArgumentException("Invalid user types for coach-to-member request");
        }
        
        return createConnectionRequest(connectionRequestDTO);
    }
    
    /**
     * Common method to create a connection request after validation.
     * 
     * @param connectionRequestDTO The connection request data
     * @return The created connection request DTO, or null if creation failed
     */
    private ConnectionRequestDTO createConnectionRequest(ConnectionRequestDTO connectionRequestDTO) {
        // Check if a pending request already exists between these users
        if (connectionRequestRepository.existsPendingRequestBetweenUsers(
                connectionRequestDTO.getSenderId(), 
                connectionRequestDTO.getReceiverId(), 
                RequestStatus.PENDING)) {
            throw new IllegalStateException("A pending connection request already exists between these users");
        }
        
        // Check if they are already connected
        Integer memberId = connectionRequestDTO.getSenderType() == UserType.MEMBER ? 
            connectionRequestDTO.getSenderId() : connectionRequestDTO.getReceiverId();
        Integer coachId = connectionRequestDTO.getSenderType() == UserType.COACH ? 
            connectionRequestDTO.getSenderId() : connectionRequestDTO.getReceiverId();
            
        if (memberCoachRepository.existsByMemberIdAndCoachId(memberId, coachId)) {
            throw new IllegalStateException("These users are already connected");
        }
        
        // Create the entity
        ConnectionRequestEntity entity = convertToEntity(connectionRequestDTO);
        entity.setStatus(RequestStatus.PENDING);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        // Save the entity
        ConnectionRequestEntity savedEntity = connectionRequestRepository.save(entity);
        
        return convertToDto(savedEntity);
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
     * Cancel a connection request by updating its status to CANCELLED.
     * This method allows the sender of a request to cancel it before it's been accepted or declined.
     * 
     * @param requestId The ID of the connection request to cancel
     * @param senderId The ID of the sender (to verify ownership)
     * @return true if the request was successfully cancelled, false otherwise
     */
    public boolean cancelConnectionRequest(Integer requestId, Integer senderId) {
        // Verify the request exists and belongs to the sender
        Optional<ConnectionRequestEntity> requestOpt = connectionRequestRepository.findByIdAndSenderId(requestId, senderId);
        
        if (requestOpt.isPresent()) {
            ConnectionRequestEntity request = requestOpt.get();
            
            // Only allow cancelling if the current status is PENDING
            if (request.getStatus() == RequestStatus.PENDING) {
                int rowsUpdated = connectionRequestRepository.updateStatusById(requestId, RequestStatus.CANCELLED);
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
        dto.setReceiverFirebaseId(entity.getReceiverFirebaseId());
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
        entity.setSenderFirebaseId(dto.getSenderFirebaseId());
        entity.setReceiverType(dto.getReceiverType());
        entity.setReceiverId(dto.getReceiverId());
        entity.setReceiverFirebaseId(dto.getReceiverFirebaseId());
        entity.setSenderFirstName(dto.getSenderFirstName());
        entity.setSenderLastName(dto.getSenderLastName());
        entity.setSenderProfilePic(dto.getSenderProfilePic());
        entity.setReceiverFirstName(dto.getReceiverFirstName());
        entity.setReceiverLastName(dto.getReceiverLastName());
        entity.setReceiverProfilePic(dto.getReceiverProfilePic());
        entity.setMessage(dto.getMessage());
        entity.setStatus(dto.getStatus());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }
}
