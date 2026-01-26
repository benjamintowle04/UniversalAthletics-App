package com.universalathletics.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// jdbcTemplate/debug endpoint removed
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.universalathletics.config.ManualMigrationRunner;

/**
 * Small protected endpoint to trigger the manual migration on-demand.
 * Protect by setting MIGRATION_RUN_SECRET in Heroku config and supplying
 * the header X-MIGRATE-SECRET: <secret> when calling.
 */
@RestController
@RequestMapping("/internal")
public class InternalMigrationController {

    private static final Logger log = LoggerFactory.getLogger(InternalMigrationController.class);

    @Autowired
    private ManualMigrationRunner migrationRunner;

    // jdbcTemplate removed - no debug endpoints

    @PostMapping("/run-manual-migration")
    public ResponseEntity<String> runManualMigration(@RequestHeader(value = "X-MIGRATE-SECRET", required = false) String secret) {
        String expected = System.getenv("MIGRATION_RUN_SECRET");
        if (expected == null || !expected.equals(secret)) {
            log.warn("Unauthorized manual migration attempt");
            return ResponseEntity.status(403).body("forbidden");
        }

        log.info("Authorized manual migration trigger received");
        migrationRunner.applyManualMigration();
        return ResponseEntity.ok("migration triggered");
    }

    /**
     * Protected debug endpoint to inspect a Coach row for a given Firebase ID.
     * Returns the raw columns plus char/byte length and HEX for troubleshooting padding/encoding.
     */
    // Note: debug endpoint removed to harden production surface. Use internal migration
    // runner logs and the manual migration endpoint for verification instead.
}
