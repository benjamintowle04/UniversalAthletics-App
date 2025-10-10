package com.universalathletics.modules.requests.session.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import com.universalathletics.modules.requests.entity.RequestEntity;
import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entity class representing a session request in the Universal Athletics system.
 */
@Entity
@Table(name = "Session_Request", 
       indexes = {
           @Index(name = "idx_sender", columnList = "Sender_Type, Sender_ID"),
           @Index(name = "idx_receiver", columnList = "Receiver_Type, Receiver_ID"),
           @Index(name = "idx_status", columnList = "Status")
       })
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class SessionRequestEntity extends RequestEntity {

    // Session-specific fields with proper JSON formatting
    @Column(name = "Session_Date_1", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate sessionDate1;

    @Column(name = "Session_Date_2", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate sessionDate2;

    @Column(name = "Session_Date_3", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate sessionDate3;

    @Column(name = "Session_Time_1", nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime sessionTime1;

    @Column(name = "Session_Time_2", nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime sessionTime2;

    @Column(name = "Session_Time_3", nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime sessionTime3;

    @Column(name = "Session_Location", nullable = false, length = 500)
    private String sessionLocation;

    @Column(name = "Session_Description", nullable = false, length = 500)
    private String sessionDescription;

    /**
     * Constructor for creating a session request with all required information.
     */
    public SessionRequestEntity(
            UserType senderType, Integer senderId,
            UserType receiverType, Integer receiverId,
            String message,
            LocalDate sessionDate1, LocalDate sessionDate2, LocalDate sessionDate3,
            LocalTime sessionTime1, LocalTime sessionTime2, LocalTime sessionTime3,
            String sessionLocation, String sessionDescription
    ) {
        super();
        this.setSenderType(senderType);
        this.setSenderId(senderId);
        this.setReceiverType(receiverType);
        this.setReceiverId(receiverId);
        this.setMessage(message);
        this.setStatus(RequestStatus.PENDING);
        this.sessionDate1 = sessionDate1;
        this.sessionDate2 = sessionDate2;
        this.sessionDate3 = sessionDate3;
        this.sessionTime1 = sessionTime1;
        this.sessionTime2 = sessionTime2;
        this.sessionTime3 = sessionTime3;
        this.sessionLocation = sessionLocation;
        this.sessionDescription = sessionDescription;
    }
}
