package com.universalathletics.modules.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/internal/run-sql")
    public ResponseEntity<String> runSql(@RequestHeader(value = "X-Migration-Secret", required = false) String secret,
                                         @RequestBody String sql) {
        String expected = System.getenv("MIGRATION_RUN_SECRET");
        if (expected == null || secret == null || !expected.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("forbidden");
        }
        try {
            jdbcTemplate.execute(sql);
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
