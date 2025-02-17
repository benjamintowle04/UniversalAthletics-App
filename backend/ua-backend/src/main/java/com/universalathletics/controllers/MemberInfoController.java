package com.universalathletics.controllers;

//-------------------------------- Imports -----------------------------------//
import com.universalathletics.entities.MemberInfoEntity;
import com.universalathletics.services.MemberInfoService;
import org.springframework.beans.factory.annotation.Autowired;
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
public class MemberInfoController {

    /**
     * Autowired instance of MemberInfoService for handling business logic.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private MemberInfoService memberInfoService;


// ------------------------- Create Member Endpoint --------------------------//
    /**
     * Creates a new member in the system.(POST)
     *
     * @param memberInfo The member information to be saved
     * @return MemberInfoEntity The created member with generated ID
     */
    @PostMapping
    public MemberInfoEntity createMember(@RequestBody MemberInfoEntity memberInfo) {
        return memberInfoService.saveMember(memberInfo);
    }


// -------------------------- Get All Members Endpoint -----------------------//
    /**
     * Retrieves all members from the system.(GET)
     *
     * @return List<MemberInfoEntity> containing all member records
     */
    @GetMapping
    public List<MemberInfoEntity> getAllMembers() {
        return memberInfoService.findAllMembers();
    }

}