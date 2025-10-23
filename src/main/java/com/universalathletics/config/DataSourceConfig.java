package com.universalathletics.config;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class DataSourceConfig {

    private static final Logger LOGGER = Logger.getLogger(DataSourceConfig.class.getName());

    // Optional environment variable provided by Heroku add-ons like JAWSDB
    @Value("${JAWSDB_URL:}")
    private String jawsdbUrl;
    // Read the standard Spring Boot datasource properties so the bean picks up
    // values defined in application.properties or provided via env vars.
    @Value("${spring.datasource.url:}")
    private String springDatasourceUrl;

    @Value("${spring.datasource.username:}")
    private String springDatasourceUsername;

    @Value("${spring.datasource.password:}")
    private String springDatasourcePassword;

    @Value("${JAWSDB_URL:}")
    private String jawsdbUrlCheck;

    @Value("${spring.datasource.url:}")
    private String springDatasourceUrlCheck;

    @PostConstruct
    public void logDatasourceChoice() {
        boolean hasJaws = jawsdbUrlCheck != null && !jawsdbUrlCheck.trim().isEmpty();
        boolean hasSpring = springDatasourceUrlCheck != null && !springDatasourceUrlCheck.trim().isEmpty();
        if (hasJaws) {
            LOGGER.log(Level.INFO, "Startup: detected JAWSDB_URL environment variable; using JAWSDB_URL as datasource (credentials not shown).");
        } else if (hasSpring) {
            LOGGER.log(Level.INFO, "Startup: detected SPRING_DATASOURCE_URL environment variable; using SPRING_DATASOURCE_URL as datasource (credentials not shown).");
        } else {
            LOGGER.log(Level.INFO, "Startup: no JAWSDB_URL or SPRING_DATASOURCE_URL env var detected; using application.properties or defaults.");
        }
    }

    /**
     * Create a DataSource when JAWSDB_URL is present (Heroku JawsDB add-on).
     */
    @Bean
    @org.springframework.context.annotation.Primary
    @ConditionalOnProperty(name = "JAWSDB_URL")
    public DataSource jawsdbDataSource() throws URISyntaxException {
        if (jawsdbUrl == null || jawsdbUrl.trim().isEmpty()) {
            throw new IllegalStateException("JAWSDB_URL is not set or empty");
        }

        String effectiveUrl = jawsdbUrl.trim();
        // Some providers may already provide a jdbc: URL; allow both mysql:// and jdbc:mysql://
        if (effectiveUrl.startsWith("jdbc:")) {
            // strip leading jdbc: to parse with URI
            effectiveUrl = effectiveUrl.substring(5);
        }

        URI dbUri;
        try {
            dbUri = new URI(effectiveUrl);
        } catch (URISyntaxException e) {
            LOGGER.log(Level.WARNING, "Failed to parse JAWSDB_URL={0}: {1}", new Object[]{jawsdbUrl, e.getMessage()});
            throw e;
        }
        String userInfo = dbUri.getUserInfo();
        String username = null;
        String password = null;
        if (userInfo != null) {
            String[] parts = userInfo.split(":");
            // URL decode credentials in case they contain special characters
            username = URLDecoder.decode(parts[0], StandardCharsets.UTF_8);
            password = parts.length > 1 ? URLDecoder.decode(parts[1], StandardCharsets.UTF_8) : null;
        }
        String host = dbUri.getHost();
        int port = dbUri.getPort() == -1 ? 3306 : dbUri.getPort();
        String path = dbUri.getPath(); // /dbname
        String dbName = path != null && path.startsWith("/") ? path.substring(1) : path;
    String jdbcUrl = String.format("jdbc:mysql://%s:%d/%s?useSSL=false&serverTimezone=UTC", host, port, dbName);

    // Non-sensitive debug info: log host, port, and database name for troubleshooting.
    LOGGER.log(Level.INFO, "Configuring DataSource for host={0} port={1} dbName={2}", new Object[]{host, port, dbName});

        DataSourceBuilder<?> dsBuilder = DataSourceBuilder.create();
        dsBuilder.url(jdbcUrl);
        if (username != null) dsBuilder.username(username);
        if (password != null) dsBuilder.password(password);
        dsBuilder.driverClassName("com.mysql.cj.jdbc.Driver");
        return dsBuilder.build();
    }

    /**
     * Create a DataSource when SPRING_DATASOURCE_URL is explicitly set (env override).
     */
    @Bean
    @ConditionalOnProperty(name = "spring.datasource.url")
    @org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean(javax.sql.DataSource.class)
    public DataSource springEnvDataSource() {
        DataSourceBuilder<?> dsBuilder = DataSourceBuilder.create();
        dsBuilder.url(springDatasourceUrl);
        if (springDatasourceUsername != null && !springDatasourceUsername.isEmpty()) dsBuilder.username(springDatasourceUsername);
        if (springDatasourcePassword != null && !springDatasourcePassword.isEmpty()) dsBuilder.password(springDatasourcePassword);
        dsBuilder.driverClassName("com.mysql.cj.jdbc.Driver");
        return dsBuilder.build();
    }
}
