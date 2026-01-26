package com.universalathletics.controller;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Small health controller useful for Heroku deploy checks.
 * - GET /health returns {"app":"ok","db":true/false}
 * The DB check runs a minimal SELECT 1 using the configured DataSource.
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("app", "ok");

        boolean dbOk = false;
        try (Connection c = dataSource.getConnection();
             Statement s = c.createStatement();
             ResultSet rs = s.executeQuery("SELECT 1")) {
            if (rs.next()) dbOk = true;
        } catch (Exception ex) {
            // swallow; we'll return db=false
        }

        resp.put("db", dbOk);
        return ResponseEntity.ok(resp);
    }
}
