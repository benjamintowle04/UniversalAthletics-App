package com.universalathletics.modules.onboarding.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.modules.memberInfo.service.MemberInfoService;
import com.universalathletics.modules.skill.entity.SkillEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin(origins = { "http://localhost:8081", "http://192.168.0.49:8080", "http://127.0.0.1:8081" })
public class OnboardingController {

    /**
     * Autowired instance of MemberInfoService for handling business logic.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private MemberInfoService memberInfoService;

    @Autowired
    private GoogleCloudStorageService googleCloudStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> completeOnboarding(
            @RequestParam("memberInfoJson") String memberInfoJson,
            @RequestParam("skillsJson") String skillsJson,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic) {
        try {
            System.out.println("Received onboarding request");
            System.out.println("Member Info JSON: " + memberInfoJson);
            System.out.println("Skills JSON: " + skillsJson);
            System.out.println("Profile Pic: " + (profilePic != null ? profilePic.getOriginalFilename() + " (" + profilePic.getSize() + " bytes)" : "null"));

            // Create a tool that knows how to convert between JSON and Java objects
            ObjectMapper objectMapper = new ObjectMapper();

            // Configure ObjectMapper to handle circular references
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Convert the memberInfoJson string into a MemberInfoEntity object
            MemberInfoEntity memberInfo = objectMapper.readValue(memberInfoJson, MemberInfoEntity.class);

            // Convert the skillsJson string into a List of SkillEntity objects
            List<SkillEntity> skills = objectMapper.readValue(skillsJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, SkillEntity.class));

            // Handle the profile picture upload for both web and mobile
            if (profilePic != null && !profilePic.isEmpty()) {
                try {
                    System.out.println("Processing profile picture upload...");
                    System.out.println("File details - Name: " + profilePic.getOriginalFilename() + 
                                     ", Size: " + profilePic.getSize() + 
                                     ", Content Type: " + profilePic.getContentType());

                    // Upload the file and get back the URL
                    // This calls the Google Cloud Storage service to upload the file to the "profiles" folder
                    String imageUrl = googleCloudStorageService.uploadFile(profilePic, "profiles");

                    // Set the URL on the member's profile
                    // This URL will be stored in the Profile_Pic column in the database
                    memberInfo.setProfilePic(imageUrl);
                    
                    System.out.println("Profile picture uploaded successfully: " + imageUrl);
                } catch (Exception e) {
                    System.err.println("Error uploading profile picture: " + e.getMessage());
                    e.printStackTrace();
                    // Continue without profile picture - don't fail the entire onboarding
                }
            }

            // Add the skills to the member
            // This uses the custom setSkills method in MemberInfoEntity
            memberInfo.setSkills(skills);

            // Save the member to the database
            // This will also save the skills relationship due to the cascade setting
            MemberInfoEntity savedMember = memberInfoService.saveMember(memberInfo);

            System.out.println("Member saved successfully with ID: " + savedMember.getId());

            // Return a successful response with the saved member
            return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
            
        } catch (JsonProcessingException e) {
            // Handle JSON parsing errors specifically
            System.err.println("JSON parsing error: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<String>("Error parsing JSON: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handle other errors
            System.err.println("General error during onboarding: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<String>("Error processing onboarding request: " + e.getMessage(), 
                                            HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
