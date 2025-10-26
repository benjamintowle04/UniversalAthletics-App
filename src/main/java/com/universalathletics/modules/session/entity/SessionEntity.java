package com.universalathletics.modules.session.entity;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

//--------------------- Session Entity Class ------------------------------//
/**
 * Entity class representing session information in the Universal Athletics
 * system.
 * This class maps to the 'Session' table in the database and contains
 * information about scheduled training sessions between coaches and members.
 *
 */

@Entity
@Table(name = "Session")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionEntity {

  /**
   * Unique identifier for the session.
   * Auto-generated using database identity strategy.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "Session_ID")
  private Integer id;

  /**
   * Reference to the session request that created this session.
   * Links back to the original request for tracking purposes.
   */
  @Column(name = "Request_ID")
  private Integer requestId;

  /**
   * Date when the session is scheduled to take place.
   */
  @Column(name = "Session_Date")
  private LocalDate sessionDate;

  /**
   * Time when the session is scheduled to start.
   */
  @Column(name = "Session_Time")
  private LocalTime sessionTime;

  /**
   * Location where the session will take place.
   * Contains the physical address or venue name.
   */
  @Column(name = "Session_Location")
  private String sessionLocation;

  /**
   * Detailed description of what the session will cover.
   * Contains information about activities, goals, and focus areas.
   */
  @Column(name = "Session_Description")
  private String sessionDescription;

  /**
   * Coach's database ID.
   */
  @Column(name = "Coach_ID")
  private Integer coachId;

  /**
   * Coach's unique Firebase authentication ID.
   */
  @Column(name = "Coach_Firebase_ID")
  private String coachFirebaseId;

  /**
   * Coach's first name.
   */
  @Column(name = "Coach_First_Name")
  private String coachFirstName;

  /**
   * Coach's last name.
   */
  @Column(name = "Coach_Last_Name")
  private String coachLastName;

  /**
   * URL or path to coach's profile picture.
   * This stores the URL returned from Google Cloud Storage after upload.
   */
  @Column(name = "Coach_Profile_Pic")
  private String coachProfilePic;

  /**
   * Member's database ID.
   */
  @Column(name = "Member_ID")
  private Integer memberId;

  /**
   * Member's first name.
   */
  @Column(name = "Member_First_Name")
  private String memberFirstName;

  /**
   * Member's last name.
   */
  @Column(name = "Member_Last_Name")
  private String memberLastName;

  /**
   * URL or path to member's profile picture.
   * This stores the URL returned from Google Cloud Storage after upload.
   */
  @Column(name = "Member_Profile_Pic")
  private String memberProfilePic;

  /**
   * Member's unique Firebase authentication ID.
   */
  @Column(name = "Member_Firebase_ID")
  private String memberFirebaseId;

  /**
   * Timestamp when the session record was created.
   */
  @Column(name = "Created_At")
  private LocalDateTime createdAt;

  /**
   * Timestamp when the session record was last updated.
   */
  @Column(name = "Updated_At")
  private LocalDateTime updatedAt;

  /**
   * Constructor for Session Entity
   * 
   */
  public SessionEntity(Integer requestId, LocalDate sessionDate, LocalTime sessionTime, 
                      String sessionLocation, String sessionDescription, Integer coachId,
                      String coachFirebaseId, String coachFirstName, String coachLastName, 
                      String coachProfilePic, Integer memberId, String memberFirstName, 
                      String memberLastName, String memberProfilePic, String memberFirebaseId) {
    
    this.requestId = requestId;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.sessionLocation = sessionLocation;
    this.sessionDescription = sessionDescription;
    this.coachId = coachId;
    this.coachFirebaseId = coachFirebaseId;
    this.coachFirstName = coachFirstName;
    this.coachLastName = coachLastName;
    this.coachProfilePic = coachProfilePic;
    this.memberId = memberId;
    this.memberFirstName = memberFirstName;
    this.memberLastName = memberLastName;
    this.memberProfilePic = memberProfilePic;
    this.memberFirebaseId = memberFirebaseId;
  }

  // -------- Getters --------- //
  public Integer getId() {
    return id;
  }

  public Integer getRequestId() {
    return requestId;
  }

  public LocalDate getSessionDate() {
    return sessionDate;
  }

  public LocalTime getSessionTime() {
    return sessionTime;
  }

  public String getSessionLocation() {
    return sessionLocation;
  }

  public String getSessionDescription() {
    return sessionDescription;
  }

  public Integer getCoachId() {
    return coachId;
  }

  public String getCoachFirebaseId() {
    return coachFirebaseId;
  }

  public String getCoachFirstName() {
    return coachFirstName;
  }

  public String getCoachLastName() {
    return coachLastName;
  }

  public String getCoachProfilePic() {
    return coachProfilePic;
  }

  public Integer getMemberId() {
    return memberId;
  }

  public String getMemberFirstName() {
    return memberFirstName;
  }

  public String getMemberLastName() {
    return memberLastName;
  }

  public String getMemberProfilePic() {
    return memberProfilePic;
  }

  public String getMemberFirebaseId() {
    return memberFirebaseId;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  // -------- Setters --------- //
  public void setId(Integer id) {
    this.id = id;
  }

  public void setRequestId(Integer requestId) {
    this.requestId = requestId;
  }

  public void setSessionDate(LocalDate sessionDate) {
    this.sessionDate = sessionDate;
  }

  public void setSessionTime(LocalTime sessionTime) {
    this.sessionTime = sessionTime;
  }

  public void setSessionLocation(String sessionLocation) {
    this.sessionLocation = sessionLocation;
  }

  public void setSessionDescription(String sessionDescription) {
    this.sessionDescription = sessionDescription;
  }

  public void setCoachId(Integer coachId) {
    this.coachId = coachId;
  }

  public void setCoachFirebaseId(String coachFirebaseId) {
    this.coachFirebaseId = coachFirebaseId;
  }

  public void setCoachFirstName(String coachFirstName) {
    this.coachFirstName = coachFirstName;
  }

  public void setCoachLastName(String coachLastName) {
    this.coachLastName = coachLastName;
  }

  public void setCoachProfilePic(String coachProfilePic) {
    this.coachProfilePic = coachProfilePic;
  }

  public void setMemberId(Integer memberId) {
    this.memberId = memberId;
  }

  public void setMemberFirstName(String memberFirstName) {
    this.memberFirstName = memberFirstName;
  }

  public void setMemberLastName(String memberLastName) {
    this.memberLastName = memberLastName;
  }

  public void setMemberProfilePic(String memberProfilePic) {
    this.memberProfilePic = memberProfilePic;
  }

  public void setMemberFirebaseId(String memberFirebaseId) {
    this.memberFirebaseId = memberFirebaseId;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
