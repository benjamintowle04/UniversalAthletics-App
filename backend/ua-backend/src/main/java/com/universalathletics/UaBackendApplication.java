package com.universalathletics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan(basePackages = {
		"com.universalathletics.entities", // Keep this for backward compatibility
		"com.universalathletics.member.model",
		"com.universalathletics.skill.model",
		"com.universalathletics.storage.model",
		"com.universalathletics.memberInfo.entity", // This seems to be where your entity is now
		"com.universalathletics.skill.entity"
})
@ComponentScan(basePackages = "com.universalathletics")
public class UaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(UaBackendApplication.class, args);
	}
}
