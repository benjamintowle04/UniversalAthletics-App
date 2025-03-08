package com.universalathletics.skill.controller;

import com.universalathletics.memberInfo.entity.MemberInfoEntity;

//-------------------------------- Imports -----------------------------------//
import com.universalathletics.skill.entity.SkillEntity;
import com.universalathletics.skill.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

//------------------------ Skill Controller Class ----------------------//
/**
 * REST Controller for handling skill operations.
 * Provides endpoints for managing skill data in the Universal Athletics
 * system.
 *
 * Responsibilities:
 * - Handle HTTP requests for member operations
 * - Delegate business logic to SkillService
 * - Process and return appropriate responses
 */

 @RestController
 @RequestMapping("/api/skills")
 @CrossOrigin(origins = "*")
public class SkillController {
    /**
     * Autowired instance of MemberInfoService for handling business logic.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private SkillService skillService;

    // -------------------------- Get All Skills Endpoint -----------------------//
    /**
     * Retrieves all skills from the system.
     *
     * @return ResponseEntity<List<SkillEntity>> with status 200 (OK) and list
     *         of all members
     */
    @GetMapping
    public ResponseEntity<List<SkillEntity>> getAllSkills() {
        List<SkillEntity> skills = skillService.getAllSkills();
        return new ResponseEntity<>(skills, HttpStatus.OK);
    }
}
