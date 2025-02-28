package com.universalathletics.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cloud-test")
public class CloudTestController {

    @Value("${gcp.bucket.name}")
    private String bucketName;

    @GetMapping
    public String testCloudConnection() {
        return "Connected to Google Cloud Storage bucket: " + bucketName;
    }
}
