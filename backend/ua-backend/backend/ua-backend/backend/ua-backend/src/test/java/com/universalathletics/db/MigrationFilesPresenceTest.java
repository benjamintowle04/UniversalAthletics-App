package com.universalathletics.db;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.nio.file.Files;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Quick verification test to ensure Flyway migration file(s) containing seed data are present in the repo.
 * This test does not connect to a database; it ensures the migration contains INSERT statements for Coach and Skill.
 */
public class MigrationFilesPresenceTest {

    @Test
    public void migrationContainsCoachAndSkillInserts() throws Exception {
        ClassPathResource res = new ClassPathResource("db/migration/V1__init_schema_and_seed.sql");
        assertTrue(res.exists(), "Migration file V1__init_schema_and_seed.sql should exist on classpath");
        String sql = Files.readString(res.getFile().toPath());
        assertTrue(sql.toLowerCase().contains("insert into coach"), "Migration must contain INSERT INTO Coach statements");
        assertTrue(sql.toLowerCase().contains("insert into skill"), "Migration must contain INSERT INTO Skill statements");
    }
}
