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

    @Value("${gcp.bucket.name}")
    private String bucketName;

    @Value("${gcp.project.id}")
    private String projectId;

    @Value("${gcp.credentials.path}")
    private String credentialsPath;

    private Storage storage;

    @PostConstruct
    public void initialize() throws IOException {
        StorageOptions storageOptions = StorageOptions.newBuilder()
            .setProjectId(projectId)
            .setCredentials(GoogleCredentials.fromStream(new FileInputStream(credentialsPath)))
            .build();
        this.storage = storageOptions.getService();
    }

    public String getSignedFileUrl(String fileName) throws IOException {
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).build();
        URL signedUrl = storage.signUrl(blobInfo, 24, TimeUnit.HOURS, Storage.SignUrlOption.signWith(
            ServiceAccountCredentials.fromStream(new FileInputStream(credentialsPath))));
        return signedUrl.toString();
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName)
            .setContentType(file.getContentType())
            .build();
        
        storage.create(blobInfo, file.getBytes());
        return fileName;
    }
}
