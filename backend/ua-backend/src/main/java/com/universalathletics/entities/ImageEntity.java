package com.universalathletics.entities;

//------------------------------- imports ------------------------------------//
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

//-------------------------- Image Entity Class ------------------------------//
/**
 * Entity class representing images in the Universal Athletics system.
 * This class maps to the 'images' table in the database and contains
 * information about stored images and their URLs.
 *
 */

@Entity
@Data
@Table(name = "images")
@NoArgsConstructor
@AllArgsConstructor
public class ImageEntity {

          /**
           * Unique identifier for the image.
           * Auto-generated using database identity strategy.
           */
          @Id
          @GeneratedValue(strategy = GenerationType.IDENTITY)
          @Column(name = "image_id")
          private Long id;

          /**
           * URL or path where the image is stored.
           * Contains the complete path to access the image resource.
           */
          @Column(name = "image_url")
          private String imageUrl;
}