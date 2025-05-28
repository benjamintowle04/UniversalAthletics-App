package com.universalathletics.modules.requests.connection.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import com.universalathletics.modules.requests.entity.RequestEntity;
import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;

/**
 * Entity class representing a connection request in the Universal Athletics
 * system.
 * This class maps to the 'Connection_Request' table in the database and contains
 * details about connection requests between users (coaches and members).
 */
@Entity
@Table(name = "Connection_Request", 
       uniqueConstraints = @UniqueConstraint(
           name = "unique_request", 
           columnNames = {"Sender_Type", "Sender_ID", "Receiver_Type", "Receiver_ID", "Status"}
       ),
       indexes = {
           @Index(name = "idx_sender", columnList = "Sender_Type, Sender_ID"),
           @Index(name = "idx_receiver", columnList = "Receiver_Type, Receiver_ID"),
           @Index(name = "idx_status", columnList = "Status")
       })
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class ConnectionRequestEntity extends RequestEntity {
    // Connection-specific fields can be added here
    
    /**
     * Constructor for creating a connection request with basic information.
     */
    public ConnectionRequestEntity(UserType senderType, Integer senderId, 
                                 UserType receiverType, Integer receiverId, 
                                 String message) {
        super();
        this.setSenderType(senderType);
        this.setSenderId(senderId);
        this.setReceiverType(receiverType);
        this.setReceiverId(receiverId);
        this.setMessage(message);
        this.setStatus(RequestStatus.PENDING);
    }
}
