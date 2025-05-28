package com.universalathletics.modules.requests.connection.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.universalathletics.modules.requests.connection.entity.ConnectionRequestEntity;
import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequestEntity, Integer> {
    
   //Custom Query methods can be added here as needed
   /**
     * Find connection requests by status, receiver type, and receiver ID.
     * Used to get pending requests for a specific member.
     * 
     * @param status The status of the request (e.g., PENDING)
     * @param receiverType The type of receiver (e.g., MEMBER)
     * @param receiverId The ID of the receiver
     * @return List of connection requests matching the criteria
     */
    List<ConnectionRequestEntity> findByStatusAndReceiverTypeAndReceiverId(
        RequestStatus status,
        UserType receiverType,
        Integer receiverId
    );
}

