package com.universalathletics.config;

import java.net.URI;
import java.net.URISyntaxException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceConfig {

    // Optional environment variable provided by Heroku add-ons like JAWSDB
    @Value("${JAWSDB_URL:}")
    private String jawsdbUrl;

    @Value("${SPRING_DATASOURCE_URL:}")
    private String springDatasourceUrl;

    @Value("${SPRING_DATASOURCE_USERNAME:}")
    private String springDatasourceUsername;

    @Value("${SPRING_DATASOURCE_PASSWORD:}")
    private String springDatasourcePassword;

    /**
     * Create a DataSource when JAWSDB_URL is present (Heroku JawsDB add-on).
     */
    @Bean
    @ConditionalOnProperty(name = "JAWSDB_URL")
    public DataSource jawsdbDataSource() throws URISyntaxException {
        URI dbUri = new URI(jawsdbUrl);
        String userInfo = dbUri.getUserInfo();
        String username = null;
        String password = null;
        if (userInfo != null) {
            String[] parts = userInfo.split(":");
            username = parts[0];
            password = parts.length > 1 ? parts[1] : null;
        }
        String host = dbUri.getHost();
        int port = dbUri.getPort() == -1 ? 3306 : dbUri.getPort();
        String path = dbUri.getPath(); // /dbname
        String dbName = path != null && path.startsWith("/") ? path.substring(1) : path;
        String jdbcUrl = String.format("jdbc:mysql://%s:%d/%s?useSSL=false&serverTimezone=UTC", host, port, dbName);

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
    @ConditionalOnProperty(name = "SPRING_DATASOURCE_URL")
    public DataSource springEnvDataSource() {
        DataSourceBuilder<?> dsBuilder = DataSourceBuilder.create();
        dsBuilder.url(springDatasourceUrl);
        if (springDatasourceUsername != null && !springDatasourceUsername.isEmpty()) dsBuilder.username(springDatasourceUsername);
        if (springDatasourcePassword != null && !springDatasourcePassword.isEmpty()) dsBuilder.password(springDatasourcePassword);
        dsBuilder.driverClassName("com.mysql.cj.jdbc.Driver");
        return dsBuilder.build();
    }
}
