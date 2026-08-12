package com.nology.todoapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import io.restassured.RestAssured;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class TodoApiApplicationTests {

    @LocalServerPort
    private int port;

	@Test
	void contextLoads() {
	}

    @Test
    void exposesOpenApiDocumentation() {
        RestAssured.port = port;

        given()
                .when()
                .get("/v3/api-docs")
                .then()
                .statusCode(200)
                .body("info.title", equalTo("Todo API"));
    }

}
