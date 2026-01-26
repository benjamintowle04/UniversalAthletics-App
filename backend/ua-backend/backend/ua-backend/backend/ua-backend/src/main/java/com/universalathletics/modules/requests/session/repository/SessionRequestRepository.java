package com.universalathletics.modules.requests.session.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.universalathletics.modules.requests.session.entity.SessionRequestEntity;
import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;

@Repository
public interface SessionRequestRepository extends JpaRepository<SessionRequestEntity, Integer> {
    
   //Custom Query methods can be added here as needed
   /**
     * Find connection requests by status, receiver type, and receiver ID.
     * Used to get pending requests for a specific member or coach.
     * 
     * @param status The status of the request (e.g., PENDING)
     * @param receiverType The type of receiver (e.g., MEMBER, COACH)
     * @param receiverId The ID of the receiver
     * @return List of connection requests matching the criteria
     */
    List<SessionRequestEntity> findByStatusAndReceiverTypeAndReceiverId(
        RequestStatus status,
        UserType receiverType,
        Integer receiverId
    );

    /**
     * Find connection requests by status, sender type, and sender ID.
     * Used to get pending requests sent by a specific member or coach.
     * 
     * @param status The status of the request (e.g., PENDING)
     * @param senderType The type of sender (e.g., MEMBER, COACH)
     * @param senderId The ID of the sender
     * @return List of connection requests matching the criteria
     */
    List<SessionRequestEntity> findByStatusAndSenderTypeAndSenderId(
        RequestStatus status,
        UserType senderType,
        Integer senderId
    );

    /**
     * Find a connection request by ID and receiver ID to ensure the user can only 
     * modify requests they are the receiver of.
     * 
     * @param requestId The ID of the connection request
     * @param receiverId The ID of the receiver
     * @return Optional containing the connection request if found
     */
    Optional<SessionRequestEntity> findByIdAndReceiverId(Integer requestId, Integer receiverId);

    /**
     * Check if a connection request already exists between two users.
     * This prevents duplicate requests in either direction.
     * 
     * @param senderId The ID of the sender
     * @param receiverId The ID of the receiver
     * @param status The status to check for
     * @return true if a request exists, false otherwise
     */
    @Query("SELECT COUNT(c) > 0 FROM SessionRequestEntity c WHERE " +
           "((c.senderId = :senderId AND c.receiverId = :receiverId) OR " +
           "(c.senderId = :receiverId AND c.receiverId = :senderId)) AND " +
           "c.status = :status")
    boolean existsPendingRequestBetweenUsers(@Param("senderId") Integer senderId, 
                                           @Param("receiverId") Integer receiverId,
                                           @Param("status") RequestStatus status);

    /**
     * Update the status of a connection request by ID.
     * 
     * @param requestId The ID of the connection request
     * @param status The new status to set
     * @return Number of rows affected
     */
    @Modifying
    @Transactional
    @Query("UPDATE SessionRequestEntity c SET c.status = :status, c.updatedAt = CURRENT_TIMESTAMP WHERE c.id = :requestId")
    int updateStatusById(@Param("requestId") Integer requestId, @Param("status") RequestStatus status);


    /**
     * Find a connection request by ID and sender ID.
     * This is used to verify that a request belongs to a specific sender before allowing cancellation.
     * 
     * @param requestId The ID of the connection request
     * @param senderId The ID of the sender
     * @return Optional containing the connection request if found, empty otherwise
     */
    Optional<SessionRequestEntity> findByIdAndSenderId(Integer requestId, Integer senderId);

}
