package com.universalathletics.modules.requests.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Base entity class for all request types in the Universal Athletics system.
 * Uses table-per-class inheritance strategy.
 */
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class RequestEntity {
    
    /**
     * Unique identifier for the request.
     * Auto-generated using database identity strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "Request_ID")
    private Integer id;

    /**
     * Type of the sender (COACH or MEMBER).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "Sender_Type", nullable = false)
    private UserType senderType;

    /**
     * ID of the sender (references either Coach_ID or Member_ID).
     */
    @Column(name = "Sender_ID", nullable = false)
    private Integer senderId;

    /**
     * Firebase ID of the sender.
     */
    @Column(name = "Sender_Firebase_ID", length = 100)
    private String senderFirebaseId;

    /**
     * Type of the receiver (COACH or MEMBER).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "Receiver_Type", nullable = false)
    private UserType receiverType;

    /**
     * ID of the receiver (references either Coach_ID or Member_ID).
     */
    @Column(name = "Receiver_ID", nullable = false)
    private Integer receiverId;

    /**
     * Firebase ID of the receiver.
     */
    @Column(name = "Reciever_Firebase_ID", length = 100)
    private String receiverFirebaseId;

    /**
     * First name of the sender.
     */
    @Column(name = "Sender_First_Name", length = 30)
    private String senderFirstName;

    /**
     * Last name of the sender.
     */
    @Column(name = "Sender_Last_Name", length = 30)
    private String senderLastName;

    /**
     * Profile picture URL of the sender.
     */
    @Column(name = "Sender_Profile_Pic", length = 500)
    private String senderProfilePic;

    /**
     * First name of the receiver.
     */
    @Column(name = "Reciever_First_Name", length = 30)
    private String receiverFirstName;

    /**
     * Last name of the receiver.
     */
    @Column(name = "Reciever_Last_Name", length = 30)
    private String receiverLastName;

    /**
     * Profile picture URL of the receiver.
     */
    @Column(name = "Reciever_Profile_Pic", length = 500)
    private String receiverProfilePic;

    /**
     * Status of the request.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    /**
     * Optional message accompanying the request.
     */
    @Column(name = "Message", length = 500)
    private String message;

    /**
     * Timestamp when the request was created.
     */
    @Column(name = "Created_At", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the request was last updated.
     */
    @Column(name = "Updated_At", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * The member entity when sender is a member.
     * This is a conditional relationship based on senderType.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Sender_ID", insertable = false, updatable = false)
    @JsonIgnore
    private MemberInfoEntity senderMember;

    /**
     * The coach entity when sender is a coach.
     * This is a conditional relationship based on senderType.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Sender_ID", insertable = false, updatable = false)
    @JsonIgnore
    private CoachEntity senderCoach;

    /**
     * The member entity when receiver is a member.
     * This is a conditional relationship based on receiverType.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Receiver_ID", insertable = false, updatable = false)
    @JsonIgnore
    private MemberInfoEntity receiverMember;

    /**
     * The coach entity when receiver is a coach.
     * This is a conditional relationship based on receiverType.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Receiver_ID", insertable = false, updatable = false)
    @JsonIgnore
    private CoachEntity receiverCoach;


    /**
     * Automatically set timestamps before persisting.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Automatically update timestamp before updating.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Helper method to get the sender entity regardless of type.
     */
    public Object getSenderEntity() {
        return senderType == UserType.MEMBER ? senderMember : senderCoach;
    }

    /**
     * Helper method to get the receiver entity regardless of type.
     */
    public Object getReceiverEntity() {
        return receiverType == UserType.MEMBER ? receiverMember : receiverCoach;
    }
}
