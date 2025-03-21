package com.universalathletics.coach.entity;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
// This import is crucial for handling the JSON serialization of bidirectional relationships
// It prevents infinite recursion when converting to JSON
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.universalathletics.skill.entity.SkillEntity;

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


  // SkillEntity
  @JsonIgnoreProperties("coaches")
  private List<SkillEntity> skills; // Renamed from skill to skills to match getter/setter

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
}
