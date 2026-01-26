package com.universalathletics.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.servlet.Filter;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

    private static final Logger log = LoggerFactory.getLogger(CorsConfig.class);

    @Bean
    public FilterRegistrationBean<Filter> corsLoggingFilter() {
        FilterRegistrationBean<Filter> fr = new FilterRegistrationBean<>();
        fr.setFilter((ServletRequest req, ServletResponse res, FilterChain chain) -> {
            if (req instanceof HttpServletRequest) {
                HttpServletRequest r = (HttpServletRequest) req;
                String origin = r.getHeader("Origin");
                String host = r.getHeader("Host");
                String xf = r.getHeader("X-Forwarded-For");
                String method = r.getMethod();
                log.info("CORS-LOG method={} origin={} host={} x-forwarded-for={}", method, origin, host, xf);
            }
            chain.doFilter(req, res);
        });
        fr.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return fr;
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow credentials (cookies, authorization headers, etc.)
        config.setAllowCredentials(true);

        // Build allowed origins from environment variable ALLOWED_ORIGINS (comma-separated)
        String allowed = System.getenv("ALLOWED_ORIGINS");
        List<String> allowedPatterns = new ArrayList<>();
        if (allowed != null && !allowed.trim().isEmpty()) {
            allowedPatterns.addAll(Arrays.stream(allowed.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        }

        // Always allow common local development origins
        allowedPatterns.addAll(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://192.168.*.*:*")
        );

        log.info("Configured ALLOWED_ORIGINS patterns: {}", allowedPatterns);

        // Use allowed origin patterns to support wildcard ports and host patterns
        config.setAllowedOriginPatterns(allowedPatterns);

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow all HTTP methods
        config.addAllowedMethod("*");

        // Apply CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
