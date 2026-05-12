package com.rythulink.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.HashMap;
import java.util.Map;

@RestController
public class DatabaseHealthController {

    private final DataSource dataSource;

    public DatabaseHealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/api/health/db")
    public ResponseEntity<?> checkDatabase() {
        Map<String, Object> response = new HashMap<>();

        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();

            response.put("status", "DB_CONNECTED");
            response.put("database", metaData.getDatabaseProductName());
            response.put("databaseVersion", metaData.getDatabaseProductVersion());
            response.put("url", metaData.getURL());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DB_NOT_CONNECTED");
            response.put("error", e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }
}