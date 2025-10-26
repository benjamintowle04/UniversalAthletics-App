package com.universalathletics.config;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.util.StreamUtils;
import org.springframework.stereotype.Component;

/**
 * Fallback runner to apply the SQL migration directly when Flyway cannot run
 * against the production MySQL (some provider product strings trip Flyway's
 * DB detection). Enable with FLYWAY_USE_FALLBACK=true and keep
 * FLYWAY_ENABLED=false to avoid the Flyway auto-configuration path.
 */
@Component
public class ManualMigrationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ManualMigrationRunner.class);

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    public ManualMigrationRunner(DataSource dataSource, JdbcTemplate jdbcTemplate) {
        this.dataSource = dataSource;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Public method to apply the manual migration. Can be invoked on-demand (e.g. via a protected HTTP endpoint).
     */
    public void applyManualMigration() {
        // Print guaranteed markers to stdout so Heroku log streaming reliably shows the runner activity
        System.out.println("MANUAL-MIGRATION-START: Applying db/migration/V1__init.sql");
        log.info("FLYWAY_USE_FALLBACK is enabled — applying SQL from classpath:db/migration/V1__init.sql");

        try {
            // Read the SQL script from classpath
            ClassPathResource resource = new ClassPathResource("db/migration/V1__init.sql");
            String sql = StreamUtils.copyToString(resource.getInputStream(), java.nio.charset.StandardCharsets.UTF_8);

            // Split statements by semicolon; keep statements that are non-empty after trim
            String[] statements = sql.split(";\n|;\r\n|;");

            int insertCount = 0;
            int otherCount = 0;

            for (String raw : statements) {
                String stmt = raw.trim();
                if (stmt.isEmpty()) continue;

                // For INSERT statements, run via JdbcTemplate.update to get affected rows
                if (stmt.regionMatches(true, 0, "INSERT", 0, 6)) {
                    try {
                        int affected = jdbcTemplate.update(stmt);
                        insertCount += Math.max(0, affected);
                        log.info("Executed INSERT statement, affected rows={}", affected);
                        System.out.println("MANUAL-MIGRATION: INSERT executed, affected=" + affected + ", stmt=" + (stmt.length() > 200 ? stmt.substring(0, 200) + "..." : stmt));
                    } catch (Exception e) {
                        log.warn("INSERT statement failed (continuing): {}", stmt.replaceAll("\\n", " "), e);
                        System.out.println("MANUAL-MIGRATION: INSERT failed: " + e.toString() + " stmt=" + (stmt.length() > 200 ? stmt.substring(0, 200) + "..." : stmt));
                    }
                } else {
                    // For non-INSERT (DDL / other), apply using ResourceDatabasePopulator to preserve script semantics
                    try {
                        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                        populator.setContinueOnError(true);
                        populator.addScript(new ClassPathResource("db/migration/V1__init.sql"));
                        // execute once for non-insert statements (we run whole script for non-insert fallback)
                        System.out.println("MANUAL-MIGRATION: Executing resource populator for DDL/other statements");
                        populator.execute(dataSource);
                        otherCount++;
                        System.out.println("MANUAL-MIGRATION: ResourceDatabasePopulator executed (continueOnError=true)");
                        break; // we've applied DDLs; don't reapply repeatedly
                    } catch (Exception e) {
                        log.warn("Non-INSERT script execution failed (continuing): {}", e.toString());
                        System.out.println("MANUAL-MIGRATION: ResourceDatabasePopulator failed: " + e.toString());
                    }
                }
            }
            log.info("Manual SQL migration finished: insertsApplied={}, otherStatementsAttempted={}", insertCount, otherCount);
            System.out.println("MANUAL-MIGRATION-END: insertsApplied=" + insertCount + ", otherStatementsAttempted=" + otherCount);
        } catch (Exception e) {
            // don't prevent the app from starting; log full stack for debugging
            System.out.println("MANUAL-MIGRATION-ERROR: " + e.toString());
            e.printStackTrace(System.out);
            log.error("Exception while applying manual SQL migration", e);
        }
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String env = System.getenv("FLYWAY_USE_FALLBACK");
        if (env == null || !env.equalsIgnoreCase("true")) {
            log.debug("FLYWAY_USE_FALLBACK not set to true — skipping manual SQL migration.");
            return;
        }

        // Delegate to the reusable method so it can be invoked on-demand as well
        applyManualMigration();
    }
}
