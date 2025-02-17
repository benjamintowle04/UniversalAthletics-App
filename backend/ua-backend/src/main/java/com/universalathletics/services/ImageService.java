package com.universalathletics.services;
//-------------------------------- Imports -----------------------------------//
import com.universalathletics.entities.ImageEntity;
import com.universalathletics.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//-------------------------------- ImageService Class ----------------------//
/**
 * ImageService handles all business logic related to image operations in the
 * Universal Athletics application.
 * This service layer acts as an intermediary between the controller and
 * repository layers.
 * 
 * Responsibilities:
 * - Image creation and management
 * - Image data validation
 * - Image information processing
 */
@Service
public class ImageService {

          /**
           * Autowired instance of ImageRepository for database operations.
           * Following Spring best practices for dependency injection.
           */
          @Autowired
          private ImageRepository imageRepository;

//--------------------------------- Create Image -----------------------------//
          /**
           * Creates or updates an image in the database.(POST)
           * 
           * @param image The ImageEntity object containing image information
           * @return ImageEntity The saved image object with generated ID
           * @throws IllegalArgumentException if image is null
           */
          public ImageEntity saveImage(ImageEntity image) {
                    if (image == null) {
                              throw new IllegalArgumentException("Image information cannot be null");
                    }
                    return imageRepository.save(image);
          }
}