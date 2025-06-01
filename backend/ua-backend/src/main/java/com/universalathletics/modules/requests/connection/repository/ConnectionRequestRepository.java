package com.universalathletics.modules.requests.connection.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * Find a connection request by ID and receiver ID to ensure the user can only 
     * modify requests they are the receiver of.
     * 
     * @param requestId The ID of the connection request
     * @param receiverId The ID of the receiver
     * @return Optional containing the connection request if found
     */
    Optional<ConnectionRequestEntity> findByIdAndReceiverId(Integer requestId, Integer receiverId);

    /**
     * Update the status of a connection request by ID.
     * 
     * @param requestId The ID of the connection request
     * @param status The new status to set
     * @return Number of rows affected
     */
    @Modifying
    @Transactional
    @Query("UPDATE ConnectionRequestEntity c SET c.status = :status, c.updatedAt = CURRENT_TIMESTAMP WHERE c.id = :requestId")
    int updateStatusById(@Param("requestId") Integer requestId, @Param("status") RequestStatus status);
}
