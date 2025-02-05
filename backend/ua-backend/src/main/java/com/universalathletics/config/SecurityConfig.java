// This configuration class temporarily disables Spring Security restrictions
// allowing all endpoints to be accessed without authentication during development
package com.universalathletics.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())        // Disable CSRF protection for REST API
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()        // Allow all requests without authentication
            );
        
        return http.build();
    }
}