package com.universalathletics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.universalathletics.entities") 

public class UaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(UaBackendApplication.class, args);
	}
}
