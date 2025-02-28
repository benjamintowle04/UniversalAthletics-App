package com.universalathletics.controllers;

//-------------------------------- Imports -----------------------------------//
import com.universalathletics.entities.MemberInfoEntity;
import com.universalathletics.services.MemberInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

//------------------------ MemberInfo Controller Class ----------------------//
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

    // ------------------------- Create Member Endpoint --------------------------//
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

// -------------------------- Get All Members Endpoint -----------------------//
    /**
     * Retrieves all members from the system.
     *
     * @return ResponseEntity<List<MemberInfoEntity>> with status 200 (OK) and list
     *         of all members
     */
    @GetMapping
    public ResponseEntity<List<MemberInfoEntity>> getAllMembers() {
        List<MemberInfoEntity> members = memberInfoService.findAllMembers();
        return new ResponseEntity<>(members, HttpStatus.OK);
    }
}