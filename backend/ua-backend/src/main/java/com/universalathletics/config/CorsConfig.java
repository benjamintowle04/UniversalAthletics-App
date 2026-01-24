package com.universalathletics.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsConfig implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        String origin = request.getHeader("Origin");

        // Read allowed origins from environment if present
        String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");

        if (origin != null && !origin.isEmpty()) {
            boolean allowed = false;
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
            } else {
                // Explicitly no origin allowed - fallback to deny
                response.setHeader("Access-Control-Allow-Origin", "null");
            }
        } else {
            response.setHeader("Access-Control-Allow-Origin", "*");
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
