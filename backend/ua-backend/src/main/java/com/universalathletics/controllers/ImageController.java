package com.universalathletics.controllers;

import com.universalathletics.models.Image;
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

        Image image = new Image();
        image.setImageUrl(imageUrl);
        imageRepository.save(image);

        return "Image uploaded successfully: " + imageUrl;
    }

    @GetMapping
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }
}
