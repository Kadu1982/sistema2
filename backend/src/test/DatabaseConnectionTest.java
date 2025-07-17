package com.sistemadesaude.backend;

import static org.junit.jupiter.api.Assertions.assertTrue;

import javax.sql.DataSource;
import java.sql.Connection;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false"
})
class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void connectsToDatabase() throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            assertTrue(conn.isValid(2));     // verifies connection is accepted
        }
    }
}
