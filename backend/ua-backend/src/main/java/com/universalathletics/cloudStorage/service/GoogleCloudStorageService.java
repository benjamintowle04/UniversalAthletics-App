package com.universalathletics.cloudStorage.service;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class GoogleCloudStorageService {

    @Value("${gcp.bucket.name:}")
    private String bucketName;

    @Value("${gcp.project.id:}")
    private String projectId;

    @Value("${gcp.credentials.path:}")
    private String credentialsPath;
    

    private Storage storage;
    private com.google.auth.oauth2.ServiceAccountCredentials serviceAccountCredentials;

    @PostConstruct
    public void initialize() throws IOException {
        // If any of the required GCP properties are missing, skip initialization.
        if (bucketName == null || bucketName.isEmpty() || projectId == null || projectId.isEmpty() || credentialsPath == null || credentialsPath.isEmpty()) {
            System.out.println("GCP configuration not provided; GoogleCloudStorageService will be disabled.");
            return;
        }

        // If credentialsPath is set but file doesn't exist, don't crash the app — disable the service instead.
        if (!Files.exists(Paths.get(credentialsPath))) {
            System.out.println("GCP credentials file not found at '" + credentialsPath + "'; GoogleCloudStorageService will be disabled.");
            return;
        }

        // Load credentials and initialize storage. Keep a reference to ServiceAccountCredentials for signing URLs.
        com.google.auth.oauth2.GoogleCredentials creds = com.google.auth.oauth2.GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
        if (creds instanceof com.google.auth.oauth2.ServiceAccountCredentials) {
            this.serviceAccountCredentials = (com.google.auth.oauth2.ServiceAccountCredentials) creds;
        } else {
            System.out.println("GCP credentials are not a service account; signed URLs may be unavailable.");
        }

        StorageOptions storageOptions = StorageOptions.newBuilder()
            .setProjectId(projectId)
            .setCredentials(creds)
            .build();
        this.storage = storageOptions.getService();
    }

    public String getSignedFileUrl(String fileName) throws IOException {
        if (storage == null) {
            throw new IllegalStateException("GoogleCloudStorageService is not configured. Set gcp.bucket.name, gcp.project.id and gcp.credentials.path to enable.");
        }

        // Make sure fileName doesn't already contain the bucket URL
        if (fileName.startsWith("https://storage.googleapis.com/")) {
            // Extract just the object name from the URL
            String bucketUrlPrefix = "https://storage.googleapis.com/" + bucketName + "/";
            if (fileName.startsWith(bucketUrlPrefix)) {
                fileName = fileName.substring(bucketUrlPrefix.length());
            } else {
                // This is a more complex URL, try to extract just the filename
                int lastSlashIndex = fileName.lastIndexOf('/');
                if (lastSlashIndex != -1) {
                    fileName = fileName.substring(lastSlashIndex + 1);
                }
            }
        }
        
        // Otherwise, we just get the signed URL as normal
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).build();
        if (this.serviceAccountCredentials == null) {
            throw new IllegalStateException("ServiceAccountCredentials missing; cannot generate signed URL.");
        }

        URL signedUrl = storage.signUrl(blobInfo, 24, TimeUnit.HOURS, Storage.SignUrlOption.signWith(this.serviceAccountCredentials));
        return signedUrl.toString();
    }
    

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (storage == null) {
            throw new IllegalStateException("GoogleCloudStorageService is not configured. Set gcp.bucket.name, gcp.project.id and gcp.credentials.path to enable.");
        }

        String fileName = folder + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName)
            .setContentType(file.getContentType())
            .build();
        
        storage.create(blobInfo, file.getBytes());
        return fileName;
    }
}
