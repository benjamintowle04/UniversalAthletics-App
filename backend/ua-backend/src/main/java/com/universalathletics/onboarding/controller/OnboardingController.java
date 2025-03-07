package com.universalathletics.onboarding.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.universalathletics.cloudStorage.service.GoogleCloudStorageService;
import com.universalathletics.memberInfo.entity.MemberInfoEntity;
import com.universalathletics.memberInfo.service.MemberInfoService;
import com.universalathletics.skill.entity.SkillEntity;
import com.universalathletics.skill.service.SkillService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

          /**
           * Autowired instance of MemberInfoService for handling business logic.
           * Following Spring best practices for dependency injection.
           */
          @Autowired
          private MemberInfoService memberInfoService;

          @Autowired
          private GoogleCloudStorageService googleCloudStorageService;

          @PostMapping
          public ResponseEntity<?> completeOnboarding(
                              @RequestParam("memberInfoJson") String memberInfoJson,
                              @RequestParam("skillsJson") String skillsJson,
                              @RequestParam(value = "profilePic", required = false) MultipartFile profilePic) {
                    try {
                              // Create a tool that knows how to convert between JSON and Java objects
                              ObjectMapper objectMapper = new ObjectMapper();

                              // Configure ObjectMapper to handle circular references
                              objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

                              // Convert the memberInfoJson string into a MemberInfoEntity object
                              MemberInfoEntity memberInfo = objectMapper.readValue(memberInfoJson,
                                                  MemberInfoEntity.class);

                              // Convert the skillsJson string into a List of SkillEntity objects
                              List<SkillEntity> skills = objectMapper.readValue(skillsJson,
                                                  objectMapper.getTypeFactory().constructCollectionType(List.class,
                                                                      SkillEntity.class));

                              // 2. Handle the profile picture upload
                              if (profilePic != null && !profilePic.isEmpty()) {
                                        // Upload the file and get back the URL
                                        // This calls the Google Cloud Storage service to upload the file to the
                                        // "profiles" folder
                                        String imageUrl = googleCloudStorageService.uploadFile(profilePic,
                                                            "profiles");

                                        // Set the URL on the member's profile
                                        // This URL will be stored in the Profile_Pic column in the database
                                        memberInfo.setProfilePic(imageUrl);
                              }

                              // Add the skills to the member
                              // This uses the custom setSkills method in MemberInfoEntity
                              memberInfo.setSkills(skills);

                              // Save the member to the database
                              // This will also save the skills relationship due to the cascade setting
                              MemberInfoEntity savedMember = memberInfoService.saveMember(memberInfo);

                              // Return a successful response with the saved member
                              return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
                    } catch (JsonProcessingException e) {
                              // Handle JSON parsing errors specifically
                              e.printStackTrace();
                              return new ResponseEntity<String>("Error parsing JSON: " + e.getMessage(),
                                                  HttpStatus.BAD_REQUEST);
                    } catch (Exception e) {
                              // Handle other errors
                              e.printStackTrace();
                              return new ResponseEntity<MemberInfoEntity>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
          }

}
