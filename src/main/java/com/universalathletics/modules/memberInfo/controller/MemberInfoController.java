package com.universalathletics.modules.memberInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;




import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.memberInfo.service.MemberInfoService;
import com.universalathletics.modules.skill.entity.SkillEntity;

import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.util.List;

/**
 * REST Controller for handling member information operations.
 * Provides endpoints for managing member data in the Universal Athletics
 * system.
 *
 * Responsibilities:
 * - Handle HTTP requests for member operations
 * - Delegate business logic to MemberInfoService
 * - Process and return appropriate responses
 */
@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberInfoController {

    /**
     * Autowired instance of MemberInfoService for handling business logic.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private MemberInfoService memberInfoService;

    /**
     * Need to use for getting the image from the cloud storage
     */
    @Autowired
    private GoogleCloudStorageService storageService;


    /**
     * Creates a new member in the system.
     *
     * @param memberInfo The member information to be saved
     * @return ResponseEntity<MemberInfoEntity> with status 201 (CREATED) and the
     *         created member
     */
    @PostMapping
    public ResponseEntity<MemberInfoEntity> createMember(@RequestBody MemberInfoEntity memberInfo) {
        MemberInfoEntity createdMember = memberInfoService.saveMember(memberInfo);
        try {
            // Fetch the freshly saved member so relationships (skills/coaches) are initialized
            MemberInfoEntity fullMember = memberInfoService.findMemberByFirebaseId(createdMember.getFirebaseID());
            // Sign profile pic URL if present
            if (fullMember.getProfilePic() != null) {
                try {
                    String signedUrl = storageService.getSignedFileUrl(fullMember.getProfilePic());
                    fullMember.setProfilePic(signedUrl);
                } catch (Exception e) {
                    System.err.println("Error signing profile URL for created member: " + e.getMessage());
                }
            }
            return new ResponseEntity<>(fullMember, HttpStatus.CREATED);
        } catch (Exception e) {
            // If anything goes wrong fetching/signing, fall back to the saved entity
            System.err.println("Warning: returning unsupplemented created member due to: " + e.getMessage());
            return new ResponseEntity<>(createdMember, HttpStatus.CREATED);
        }
    }

    /**
     * Updates an existing member's profile information.
     *
     * @param firebaseId The Firebase ID of the member to update
     * @param memberInfo The updated member information
     * @return ResponseEntity<MemberInfoEntity> with status 200 (OK) and the updated member
     */
    @PutMapping(value = "/update/{firebaseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MemberInfoEntity> updateMember(
            @PathVariable String firebaseId,
            @RequestParam("memberInfoJson") String memberInfoJson,
            @RequestParam("skillsJson") String skillsJson,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic) {
        try {
            System.out.println("PUT endpoint hit! Firebase ID: " + firebaseId);
            System.out.println("Member Info JSON: " + memberInfoJson);
            System.out.println("Skills JSON: " + skillsJson);
            System.out.println("Profile Pic: " + (profilePic != null ? profilePic.getOriginalFilename() : "null"));

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            MemberInfoEntity memberInfo = objectMapper.readValue(memberInfoJson, MemberInfoEntity.class);
            List<SkillEntity> skills = objectMapper.readValue(skillsJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, SkillEntity.class));

            // Handle profile picture upload
            if (profilePic != null && !profilePic.isEmpty()) {
                try {
                    String imageUrl = storageService.uploadFile(profilePic, "profiles");
                    memberInfo.setProfilePic(imageUrl);
                    System.out.println("Profile picture uploaded successfully: " + imageUrl);
                } catch (Exception e) {
                    System.err.println("Error uploading profile picture: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            memberInfo.setSkills(skills);
            memberInfo.setFirebaseID(firebaseId);

            MemberInfoEntity updatedMember = memberInfoService.updateMember(memberInfo);
            return new ResponseEntity<>(updatedMember, HttpStatus.OK);

        } catch (JsonProcessingException e) {
            System.err.println("JSON parsing error: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("Error updating member: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all members from the system.
     *
     * @return ResponseEntity<List<MemberInfoEntity>> with status 200 (OK) and list
     *         of all members
     */
    @GetMapping
    public ResponseEntity<List<MemberInfoEntity>> getAllMembers() throws IOException {
        try {
            List<MemberInfoEntity> members = memberInfoService.findAllMembers();
            for (MemberInfoEntity member : members) {
                if (member.getProfilePic() != null) {
                    String signedUrl = storageService.getSignedFileUrl(member.getProfilePic());
                    member.setProfilePic(signedUrl);
                }
            }
            return new ResponseEntity<>(members, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    /**
     * Retrieves a member by their FirebaseID.
     * 
     **/
    @GetMapping("/{firebaseId}")
    public ResponseEntity<MemberInfoEntity> getMemberByFirebaseId(@PathVariable String firebaseId) throws IOException {
        MemberInfoEntity member = memberInfoService.findMemberByFirebaseId(firebaseId);
        if (member != null) {
            // Get fresh signed URL for the profile picture
            if (member.getProfilePic() != null) {
                String signedUrl = storageService.getSignedFileUrl(member.getProfilePic());
                member.setProfilePic(signedUrl);
            }
            return new ResponseEntity<>(member, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Endpoint to retrieve all coaches associated with a specific member.
     * 
    * @param memberId The unique identifier of the member
    * @return ResponseEntity containing a list of coaches or appropriate error response
    */
    @GetMapping("/{memberId}/coaches")
    public ResponseEntity<List<CoachEntity>> getMemberCoaches(@PathVariable Integer memberId) {
        try {
            List<CoachEntity> coaches = memberInfoService.getMemberCoaches(memberId);
            for (CoachEntity coach : coaches) {
                if (coach.getProfilePic() != null) {
                    String signedUrl = storageService.getSignedFileUrl(coach.getProfilePic());
                    coach.setProfilePic(signedUrl);
                }
            }
            return ResponseEntity.ok(coaches);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}