package com.universalathletics.modules.requests.session.model;

import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionRequestDTO {
    private Integer id;
    private UserType senderType;
    private Integer senderId;
    private String senderFirebaseId;
    private UserType receiverType;
    private Integer receiverId;
    private String receiverFirebaseId;
    private String senderFirstName;
    private String senderLastName;
    private String senderProfilePic;
    private String receiverFirstName;
    private String receiverLastName;
    private String receiverProfilePic;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate sessionDate1;
    private LocalDate sessionDate2;
    private LocalDate sessionDate3;
    private LocalTime sessionTime1;
    private LocalTime sessionTime2;
    private LocalTime sessionTime3;
    private String sessionLocation;
    private String sessionDescription;
}
