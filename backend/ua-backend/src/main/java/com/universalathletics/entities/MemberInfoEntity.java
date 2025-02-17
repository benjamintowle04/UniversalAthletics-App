package com.universalathletics.entities;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

//--------------------- MemberInfo Entity Class ------------------------------//
/**
 * Entity class representing member information in the Universal Athletics system.
 * This class maps to the 'member_info' table in the database and contains
 * personal and contact information for each member.
 *
 */

@Entity
@Data
@Table(name = "member_info")
@NoArgsConstructor
@AllArgsConstructor
public class MemberInfoEntity {

          /**
           * Unique identifier for the member.
           * Auto-generated using database identity strategy.
           */
          @Id
          @Column(name = "member_id")
          @GeneratedValue(strategy = GenerationType.IDENTITY)
          private int memberId;

          /**
           * Member's first name.
           */
          @Column(name = "first_name")
          private String firstName;

          /**
           * Member's last name.
           */
          @Column(name = "last_name")
          private String lastName;

          /**
           * Member's email address.
           * Used for communication and account identification.
           */
          @Column(name = "email")
          private String email;

          /**
           * Member's contact phone number.
           */
          @Column(name = "phone")
          private String phone;

          /**
           * Member's biographical information.
           * Contains a brief description or background of the member.
           */
          @Column(name = "biography")
          private String biography;

          /**
           * URL or path to member's profile picture.
           */
          @Column(name = "profile_pic")
          private String profilePic;

          /**
           * Member's geographical location or address.
           */
          @Column(name = "location")
          private String location;
}
