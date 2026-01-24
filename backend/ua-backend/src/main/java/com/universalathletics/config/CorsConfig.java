package com.universalathletics.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsConfig implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        String origin = request.getHeader("Origin");

        // Read allowed origins from environment if present
        String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");

        // Log request info to help debug CORS rejections (do not log sensitive headers)
        logger.info("CORS request incoming: method={}, origin={}, host={}, x-forwarded-for={}",
                request.getMethod(), origin, request.getHeader("Host"), request.getHeader("X-Forwarded-For"));
        logger.debug("ALLOWED_ORIGINS env: {}", allowedOriginsEnv);

        boolean allowed = false;
        if (origin != null && !origin.isEmpty()) {
            if (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) {
                String[] allowedArr = allowedOriginsEnv.split(",");
                for (String a : allowedArr) {
                    if (origin.equalsIgnoreCase(a.trim())) {
                        allowed = true;
                        break;
                    }
                }
            } else {
                // If no env var, allow the Origin by default
                allowed = true;
            }

            if (allowed) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Vary", "Origin");
                logger.info("CORS allow: origin {} accepted", origin);
            } else {
                // Explicitly no origin allowed - fallback to deny
                response.setHeader("Access-Control-Allow-Origin", "null");
                logger.warn("CORS deny: origin {} not in allowed list", origin);
            }
        } else {
            response.setHeader("Access-Control-Allow-Origin", "*");
            logger.info("CORS allow: no Origin header, defaulting to '*'");
        }

        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
}
