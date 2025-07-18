package com.universalathletics.modules.memberInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.memberInfo.service.MemberInfoService;

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
        return new ResponseEntity<>(createdMember, HttpStatus.CREATED);
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