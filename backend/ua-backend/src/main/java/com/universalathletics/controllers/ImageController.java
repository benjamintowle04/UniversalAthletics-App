package com.universalathletics.controllers;

import com.universalathletics.entities.ImageEntity;
import com.universalathletics.repositories.ImageRepository;
import com.universalathletics.services.GoogleCloudStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private GoogleCloudStorageService storageService;

    @Autowired
    private ImageRepository imageRepository;

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file,
                            @RequestParam("folder") String folder) throws IOException {
        String imageUrl = storageService.uploadFile(file, folder);

        ImageEntity image = new ImageEntity();
        image.setImageUrl(imageUrl);
        imageRepository.save(image);

        return "Image uploaded successfully: " + imageUrl;
    }

    @GetMapping
    public List<ImageEntity> getAllImages() {
        return imageRepository.findAll();
    }
}
