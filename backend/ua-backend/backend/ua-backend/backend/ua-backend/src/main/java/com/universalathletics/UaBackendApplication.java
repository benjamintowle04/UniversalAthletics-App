package com.universalathletics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

	

@SpringBootApplication
@EntityScan(basePackages = {
		"com.universalathletics.modules.skill.model",
		"com.universalathletics.modules.memberInfo.entity",
		"com.universalathletics.modules.skill.entity",
		"com.universalathletics.modules.coach.entity",
		"com.universalathletics.modules.coach.model",
		"com.universalathletics.modules.requests.connection.entity",
		"com.universalathletics.modules.jct.memberCoach.entity",
		"com.universalathletics.modules.requests.session.entity",
		"com.universalathletics.modules.session.entity",
		"com.universalathletics.modules.jct.coachSkill.entity",
		"com.universalathletics.modules.jct.coachSkill.model",
})
@ComponentScan(basePackages = "com.universalathletics")
public class UaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(UaBackendApplication.class, args);
	}
}
