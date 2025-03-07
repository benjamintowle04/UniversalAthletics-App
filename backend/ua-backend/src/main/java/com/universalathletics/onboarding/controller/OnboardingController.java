package com.universalathletics.onboarding.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
          public ResponseEntity<MemberInfoEntity> completeOnboarding(
                              @RequestParam("memberInfoJson") String memberInfoJson,
                              @RequestParam("skillsJson") String skillsJson,
                              @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
                    try {

                              // Create a tool that knows how to convert between JSON and Java objects
                              ObjectMapper objectMapper = new ObjectMapper();

                              // Convert the memberInfoJson string into a MemberInfoEntity object
                              MemberInfoEntity memberInfo = objectMapper.readValue(memberInfoJson,
                                                  MemberInfoEntity.class);

                              // Convert the skillsJson string into a List of SkillEntity objects
                              List<SkillEntity> skills = objectMapper.readValue(skillsJson,
                                                  objectMapper.getTypeFactory().constructCollectionType(List.class,
                                                                      SkillEntity.class));

                              // 2. Handle the profile picture upload
                              if (profilePicture != null && !profilePicture.isEmpty()) {
                                        // Upload the file and get back the URL
                                        String imageUrl = googleCloudStorageService.uploadFile(profilePicture,
                                                            "profiles");

                                        // Set the URL on the member's profile
                                        memberInfo.setProfilePic(imageUrl);
                              }

                              // Add the skills to the member
                              memberInfo.setSkills(skills);

                              // Save the member to the database
                              MemberInfoEntity savedMember = memberInfoService.saveMember(memberInfo);

                              //  Return a successful response with the saved member
                              return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
                    } catch (Exception e) {
                              // 6. Handle any errors
                              e.printStackTrace();
                              return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
          }

}
