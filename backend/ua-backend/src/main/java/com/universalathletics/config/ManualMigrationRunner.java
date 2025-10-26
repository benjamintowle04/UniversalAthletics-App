package com.universalathletics.config;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

/**
 * Fallback runner to apply the SQL migration directly when Flyway cannot run
 * against the production MySQL (some provider product strings trip Flyway's
 * DB detection). Enable with FLYWAY_USE_FALLBACK=true and keep
 * FLYWAY_ENABLED=false to avoid the Flyway auto-configuration path.
 */
@Component
@ConditionalOnProperty(name = "FLYWAY_USE_FALLBACK", havingValue = "true")
public class ManualMigrationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ManualMigrationRunner.class);

    private final DataSource dataSource;

    public ManualMigrationRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("FLYWAY_USE_FALLBACK is enabled — applying SQL from classpath:db/migration/V1__init.sql");

        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        // don't fail the startup if some statements already exist (idempotent-ish)
        populator.setContinueOnError(true);
        populator.addScript(new ClassPathResource("db/migration/V1__init.sql"));

        populator.execute(dataSource);
        log.info("Manual SQL migration (fallback) complete.");
    }
}
