package com.universalathletics.modules.coach.entity;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

// This import is crucial for handling the JSON serialization of bidirectional relationships
// It prevents infinite recursion when converting to JSON
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.skill.entity.SkillEntity;
import com.universalathletics.modules.jct.coachSkill.model.CoachSkillDTO;
import com.universalathletics.modules.jct.coachSkill.entity.CoachSkillEntity;


//--------------------- Coach Entity Class ------------------------------//
/**
 * Entity class representing coach information in the Universal Athletics
 * system.
 * This class maps to the 'Coach' table in the database and contains
 * personal and contact information for each coach.
 *
 */

@Entity
@Table(name = "Coach")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoachEntity {

  /**
   * Unique identifier for the coach.
   * Auto-generated using database identity strategy.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "Coach_ID")
  private Integer id;

  /**
   * Coach's first name.
   */
  @Column(name = "First_Name")
  private String firstName;

  /**
   * Coach's last name.
   */
  @Column(name = "Last_Name")
  private String lastName;

  /**
   * Coach's email address.
   * Used for communication and account identification.
   */
  @Column(name = "Email")
  private String email;

  /**
   * Coach's contact phone number.
   * NOTE: This field has a size limit in the database.
   * If you're getting "Data too long for column 'Phone'" errors,
   * either shorten the phone number format or alter the database column.
   */
  @Column(name = "Phone")
  private String phone;

  /**
   * Coach's biographical information.
   * Contains a brief description or background of the coach.
   */
  @Column(name = "Biography_1")
  private String biography1;

  /**
   * Coach's biographical information.
   * Contains a brief description or background of the coach.
   * This field is optional and can be null.
  */
  @Column(name = "Biography_2")
  private String biography2;

  /**
   * URL or path to coach's profile picture.
   * This stores the URL returned from Google Cloud Storage after upload.
   */
  @Column(name = "Profile_Pic")
  private String profilePic;

  /**
   * URL or path to coach's bio picture.
   * This stores the URL returned from Google Cloud Storage after upload.
   */
  @Column(name = "Bio_Pic_1")
  private String bioPic1;

  /**
   * URL or path to coach's bio picture.
   */
  @Column(name = "Bio_Pic_2")
  private String bioPic2;

  /**
   * Coach's geographical location or address.
   */
  @Column(name = "Location")
  private String location;

  /**
   * Coach's unique authentication token.
   */
  @Column(name = "Firebase_ID")
  private String firebaseID;

  // Define the relationship with CoachSkillEntity for skills with levels
  @OneToMany(mappedBy = "coach", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JsonIgnore
  private List<CoachSkillEntity> coachSkills;

  // Define the junction table for many-to-many relationship with Members
  @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
  @JoinTable(name = "Member_Coach",
    joinColumns = @JoinColumn(name = "Coach_ID", referencedColumnName = "Coach_ID"),
    inverseJoinColumns = @JoinColumn(name = "Member_ID", referencedColumnName = "Member_ID"))
  @JsonIgnore
  private List<MemberInfoEntity> members;

  // Transient field for JSON serialization - skills with levels
  @Transient
  private List<CoachSkillDTO> skillsWithLevels;

  /**
   * Constructor for Coach Entity
   * 
   */
  public CoachEntity(String firstName, String lastName, String email, String phone, String biography1, 
                      String biography2, String profilePic, String bioPic1, String bioPic2, String location, String firebaseID) {
    
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.biography1 = biography1;
    this.biography2 = biography2;
    this.profilePic = profilePic;
    this.bioPic1 = bioPic1;
    this.bioPic2 = bioPic2;
    this.location = location;
    this.firebaseID = firebaseID;
  }

  /**
   * Getter for coach skills with levels
   *
   * @return List of CoachSkillEntity
   */
  public List<CoachSkillEntity> getCoachSkills() {
    return this.coachSkills; 
  }

  /**
   * Setter for coach skills with levels
   *
   * @param coachSkills List of CoachSkillEntity
   */
  public void setCoachSkills(List<CoachSkillEntity> coachSkills) {
    this.coachSkills = coachSkills;
  }

  /**
   * Getter for skills with levels (transient field for JSON)
   *
   * @return List of CoachSkillDTO
   */
  public List<CoachSkillDTO> getSkillsWithLevels() {
    return this.skillsWithLevels;
  }

  /**
   * Setter for skills with levels (transient field for JSON)
   *
   * @param skillsWithLevels List of CoachSkillDTO
   */
  public void setSkillsWithLevels(List<CoachSkillDTO> skillsWithLevels) {
    this.skillsWithLevels = skillsWithLevels;
  }

  // Keep the old getSkills method for backward compatibility
  /**
   * Getter used by CoachService to get the attached skills of a certain coach
   * @deprecated Use getCoachSkills() instead for skill levels
   * @return List of SkillEntity (without levels)
   */
  @Deprecated
  public List<SkillEntity> getSkills() {
    if (this.coachSkills != null) {
      return this.coachSkills.stream()
        .map(CoachSkillEntity::getSkill)
        .collect(java.util.stream.Collectors.toList());
    }
    return null;
  }

  /**
   * Setter used by CoachService to save a set of skills to a coach
   * @deprecated Use setCoachSkills() instead for skill levels
   * @param skills List of SkillEntity
   */
  @Deprecated
  public void setSkills(List<SkillEntity> skills) {
    // This method is kept for backward compatibility but should not be used
    // Use setCoachSkills() instead
  }

  // -------- Getters --------- //
  public Integer getId() {
    return id;
  }
  public String getFirstName() {
    return firstName;
  }
  public String getLastName() {
    return lastName;
  }
  public String getEmail() {
    return email;
  }
  public String getPhone() {
    return phone;
  }
  public String getBiography1() {
    return biography1;
  }
  public String getBiography2() {
    return biography2;
  }
  public String getProfilePic() {
    return profilePic;
  }
  public String getBioPic1() {
    return bioPic1;
  }
  public String getBioPic2() {
    return bioPic2;
  }
  public String getLocation() {
    return location;
  }
  public String getFirebaseID() {
    return firebaseID;
  }
  public List<MemberInfoEntity> getMembers() {
    return members;
  }

  // -------- Setters --------- //
  public void setId(Integer id) {
    this.id = id;
  }
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
  public void setEmail(String email) {
    this.email = email;
  }
  public void setPhone(String phone) {
    this.phone = phone;
  }
  public void setBiography1(String biography1) {
    this.biography1 = biography1;
  }
  public void setBiography2(String biography2) {
    this.biography2 = biography2;
  }
  public void setProfilePic(String profilePic) {
    this.profilePic = profilePic;
  }
  public void setBioPic1(String bioPic1) {
    this.bioPic1 = bioPic1;
  }
  public void setBioPic2(String bioPic2) {
    this.bioPic2 = bioPic2;
  }
  public void setLocation(String location) {
    this.location = location;
  }
  public void setFirebaseID(String firebaseID) {
    this.firebaseID = firebaseID;
  }
  public void setMembers(List<MemberInfoEntity> members) {
    this.members = members;
  }
}
