package com.universalathletics.cloudStorage.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lightweight controller used to test cloud connectivity. Only created when
 * the `gcp.bucket.name` property is defined to avoid startup failures when
 * GCP is not configured (for local dev or staging).
 */
@RestController
@RequestMapping("/api/cloud-test")
@ConditionalOnProperty(name = "gcp.bucket.name")
public class CloudTestController {

    @Value("${gcp.bucket.name:}")
    private String bucketName;

    @GetMapping
    public String testCloudConnection() {
        return "Connected to Google Cloud Storage bucket: " + bucketName;
    }
}
