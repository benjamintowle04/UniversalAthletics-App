package com.universalathletics.modules.requests.connection.model;

import com.universalathletics.modules.requests.util.enums.RequestStatus;
import com.universalathletics.modules.requests.util.enums.UserType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequestDTO {
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
}
