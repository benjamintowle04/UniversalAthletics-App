package com.universalathletics.cloudStorage.service;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
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

    @PostConstruct
    public void initialize() throws IOException {
        // If any of the required GCP properties are missing, skip initialization.
        if (bucketName == null || bucketName.isEmpty() || projectId == null || projectId.isEmpty() || credentialsPath == null || credentialsPath.isEmpty()) {
            // don't initialize storage; the service will operate in no-op mode
            System.out.println("GCP configuration not provided; GoogleCloudStorageService will be disabled.");
            return;
        }

        StorageOptions storageOptions = StorageOptions.newBuilder()
            .setProjectId(projectId)
            .setCredentials(GoogleCredentials.fromStream(new FileInputStream(credentialsPath)))
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
        URL signedUrl = storage.signUrl(blobInfo, 24, TimeUnit.HOURS, Storage.SignUrlOption.signWith(
            ServiceAccountCredentials.fromStream(new FileInputStream(credentialsPath))));
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
