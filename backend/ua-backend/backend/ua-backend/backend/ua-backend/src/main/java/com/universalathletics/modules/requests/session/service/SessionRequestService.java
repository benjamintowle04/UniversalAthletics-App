package com.universalathletics.modules.requests.session.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.universalathletics.modules.requests.session.entity.SessionRequestEntity;
import com.universalathletics.modules.requests.session.model.SessionRequestDTO;
import com.universalathletics.modules.requests.session.repository.SessionRequestRepository;
import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;

/**
 * Service class for routing session request operations. 
 */
@Service
public class SessionRequestService {
    
    @Autowired
    private SessionRequestRepository sessionRequestRepository;
    
    /**
     * Get all pending session requests where the recipient is a member with the specified ID.
     */
    public List<SessionRequestDTO> getPendingRequestsForMember(Integer memberId) {
        List<SessionRequestEntity> entities = sessionRequestRepository.findByStatusAndReceiverTypeAndReceiverId(
            RequestStatus.PENDING, 
            UserType.MEMBER, 
            memberId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all pending session requests where the recipient is a coach with the specified ID.
     */
    public List<SessionRequestDTO> getPendingRequestsForCoach(Integer coachId) {
        List<SessionRequestEntity> entities = sessionRequestRepository.findByStatusAndReceiverTypeAndReceiverId(
            RequestStatus.PENDING, 
            UserType.COACH, 
            coachId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all pending session requests sent by a member with the specified ID.
     */
    public List<SessionRequestDTO> getPendingRequestsSentByMember(Integer memberId) {
        List<SessionRequestEntity> entities = sessionRequestRepository.findByStatusAndSenderTypeAndSenderId(
            RequestStatus.PENDING, 
            UserType.MEMBER, 
            memberId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all pending session requests sent by a coach with the specified ID.
     */
    public List<SessionRequestDTO> getPendingRequestsSentByCoach(Integer coachId) {
        List<SessionRequestEntity> entities = sessionRequestRepository.findByStatusAndSenderTypeAndSenderId(
            RequestStatus.PENDING, 
            UserType.COACH, 
            coachId
        );
        
        return entities.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Create a new session request from a member to a coach.
     * NOTE: Unlike connection requests, session requests are allowed between already connected users.
     */
    @Transactional
    public SessionRequestDTO createMemberToCoachRequest(SessionRequestDTO sessionRequestDTO) {
        // Validate that sender is MEMBER and receiver is COACH
        if (sessionRequestDTO.getSenderType() != UserType.MEMBER || 
            sessionRequestDTO.getReceiverType() != UserType.COACH) {
            throw new IllegalArgumentException("Invalid user types for member-to-coach session request");
        }
        
        return createSessionRequest(sessionRequestDTO);
    }
    
    /**
     * Create a new session request from a coach to a member.
     * NOTE: Unlike connection requests, session requests are allowed between already connected users.
     */
    @Transactional
    public SessionRequestDTO createCoachToMemberRequest(SessionRequestDTO sessionRequestDTO) {
        // Validate that sender is COACH and receiver is MEMBER
        if (sessionRequestDTO.getSenderType() != UserType.COACH || 
            sessionRequestDTO.getReceiverType() != UserType.MEMBER) {
            throw new IllegalArgumentException("Invalid user types for coach-to-member session request");
        }
        
        return createSessionRequest(sessionRequestDTO);
    }
    
    /**
     * Common method to create a session request after validation.
     * NOTE: No connection check - session requests are allowed between connected users.
     */
    private SessionRequestDTO createSessionRequest(SessionRequestDTO sessionRequestDTO) {
        // Optional: Check if a pending session request already exists between these users
        // You can uncomment this if you want to prevent duplicate pending session requests
        /*
        if (sessionRequestRepository.existsPendingRequestBetweenUsers(
                sessionRequestDTO.getSenderId(), 
                sessionRequestDTO.getReceiverId(), 
                RequestStatus.PENDING)) {
            throw new IllegalStateException("A pending session request already exists between these users");
        }
        */
        
        // Create the entity
        SessionRequestEntity entity = convertToEntity(sessionRequestDTO);
        entity.setStatus(RequestStatus.PENDING);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        // Save the entity
        SessionRequestEntity savedEntity = sessionRequestRepository.save(entity);
        
        return convertToDto(savedEntity);
    }
    
    /**
     * Accept a session request by updating its status to ACCEPTED.
     */
    @Transactional
    public boolean acceptSessionRequest(Integer requestId, Integer receiverId) {
        Optional<SessionRequestEntity> requestOpt = sessionRequestRepository.findByIdAndReceiverId(requestId, receiverId);
        
        if (requestOpt.isPresent()) {
            SessionRequestEntity request = requestOpt.get();
            
            if (request.getStatus() == RequestStatus.PENDING) {
                int rowsUpdated = sessionRequestRepository.updateStatusById(requestId, RequestStatus.ACCEPTED);
                return rowsUpdated > 0;
            }
        }
        
        return false;
    }
    
    /**
     * Decline a session request by updating its status to REJECTED.
     */
    public boolean declineSessionRequest(Integer requestId, Integer receiverId) {
        Optional<SessionRequestEntity> requestOpt = sessionRequestRepository.findByIdAndReceiverId(requestId, receiverId);
        
        if (requestOpt.isPresent()) {
            SessionRequestEntity request = requestOpt.get();
            
            if (request.getStatus() == RequestStatus.PENDING) {
                int rowsUpdated = sessionRequestRepository.updateStatusById(requestId, RequestStatus.REJECTED);
                return rowsUpdated > 0;
            }
        }
        
        return false;
    }
    
    /**
     * Cancel a session request by updating its status to CANCELLED.
     */
    public boolean cancelSessionRequest(Integer requestId, Integer senderId) {
        Optional<SessionRequestEntity> requestOpt = sessionRequestRepository.findByIdAndSenderId(requestId, senderId);
        
        if (requestOpt.isPresent()) {
            SessionRequestEntity request = requestOpt.get();
            
            if (request.getStatus() == RequestStatus.PENDING) {
                int rowsUpdated = sessionRequestRepository.updateStatusById(requestId, RequestStatus.CANCELLED);
                return rowsUpdated > 0;
            }
        }
        
        return false;
    }
    
    /**
     * Convert SessionRequestEntity to SessionRequestDTO
     */
    private SessionRequestDTO convertToDto(SessionRequestEntity entity) {
        SessionRequestDTO dto = new SessionRequestDTO();
        // Copy all fields from RequestEntity
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
        
        // Copy session-specific fields
        dto.setSessionDate1(entity.getSessionDate1());
        dto.setSessionDate2(entity.getSessionDate2());
        dto.setSessionDate3(entity.getSessionDate3());
        dto.setSessionTime1(entity.getSessionTime1());
        dto.setSessionTime2(entity.getSessionTime2());
        dto.setSessionTime3(entity.getSessionTime3());
        dto.setSessionLocation(entity.getSessionLocation());
        dto.setSessionDescription(entity.getSessionDescription());
        
        return dto;
    }
    
    /**
     * Convert SessionRequestDTO to SessionRequestEntity
     */
    private SessionRequestEntity convertToEntity(SessionRequestDTO dto) {
        SessionRequestEntity entity = new SessionRequestEntity();
        // Copy all fields from RequestEntity
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
        
        // Copy session-specific fields
        entity.setSessionDate1(dto.getSessionDate1());
        entity.setSessionDate2(dto.getSessionDate2());
        entity.setSessionDate3(dto.getSessionDate3());
        entity.setSessionTime1(dto.getSessionTime1());
        entity.setSessionTime2(dto.getSessionTime2());
        entity.setSessionTime3(dto.getSessionTime3());
        entity.setSessionLocation(dto.getSessionLocation());
        entity.setSessionDescription(dto.getSessionDescription());
        
        return entity;
    }
}
