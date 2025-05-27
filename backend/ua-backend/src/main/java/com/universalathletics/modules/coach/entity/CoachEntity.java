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
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.skill.entity.SkillEntity;;


//--------------------- Coach Entity Class ------------------------------//
/**
 * Entity class representing member information in the Universal Athletics
 * system.
 * This class maps to the 'member_info' table in the database and contains
 * personal and contact information for each member.
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
   * Member's first name.
   */
  @Column(name = "First_Name")
  private String firstName;

  /**
   * Member's last name.
   */
  @Column(name = "Last_Name")
  private String lastName;

  /**
   * Member's email address.
   * Used for communication and account identification.
   */
  @Column(name = "Email")
  private String email;

  /**
   * Member's contact phone number.
   * NOTE: This field has a size limit in the database.
   * If you're getting "Data too long for column 'Phone'" errors,
   * either shorten the phone number format or alter the database column.
   */
  @Column(name = "Phone")
  private String phone;

  /**
   * Member's biographical information.
   * Contains a brief description or background of the member.
   */
  @Column(name = "Biography_1")
  private String biography1;

  /**
   * Member's biographical information.
   * Contains a brief description or background of the member.
   * This field is optional and can be null.
  */
  @Column(name = "Biography_2")
  private String biography2;

  /**
   * URL or path to member's profile picture.
   * This stores the URL returned from Google Cloud Storage after upload.
   */
  @Column(name = "Profile_Pic")
  private String profilePic;

  /**
   * URL or path to member's bio picture.
   * This stores the URL returned from Google Cloud Storage after upload.
   */
  @Column(name = "Bio_Pic_1")
  private String bioPic1;

  /**
   * URL or path to member's bio picture.
   */
  @Column(name = "Bio_Pic_2")
  private String bioPic2;


  /**
   * Member's geographical location or address.
   */
  @Column(name = "Location")
  private String location;

  /**
   * Member's unique authentication token.
   */
  @Column(name = "Firebase_ID")
  private String firebaseID;

  // Define the junction table for many-to-many relationship with Skills
  @ManyToMany
  (fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
  @JoinTable(name = "Coach_Skill",
    joinColumns = @JoinColumn(name = "Coach_ID", referencedColumnName = "Coach_ID"),
    inverseJoinColumns = @JoinColumn(name = "Skill_ID", referencedColumnName = "Skill_ID"))
  @JsonIgnore
  private List<SkillEntity> skills; // Renamed from skill to skills to match getter/setter


  // Define the junction table for many-to-many relationship with Members
  @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
  @JoinTable(name = "Member_Coach",
    joinColumns = @JoinColumn(name = "Coach_ID", referencedColumnName = "Coach_ID"),
    inverseJoinColumns = @JoinColumn(name = "Member_ID", referencedColumnName = "Member_ID"))
  @JsonIgnore
  private List<MemberInfoEntity> members;

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
   * Getter used by CoachService to get the attached skills of a certain
   * member
   *
   * @return skill, the instance list of skills for Coach
   */
  public List<SkillEntity> getSkills() {
    return this.skills; // Updated to use the renamed field
  }

  /**
   * Setter used by CoachService to save a set of skills to a member
   *
   * @param skill
   */
  public void setSkills(List<SkillEntity> skills) {
    this.skills = skills; // Updated to use the renamed field
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
  public List<SkillEntity> getSkill() {
    return skills;
  }


  


}
