package com.nology.todoapi;

import com.nology.todoapi.category.CategoryRepository;
import com.nology.todoapi.todos.TodosRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class TodoEndpointsIntegrationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TodosRepository todosRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        todosRepository.deleteAll();
        categoryRepository.deleteAll();
        RestAssured.port = port;
    }

    @Test
    void categoryEndpointsCreateUpdateListAndSoftDeleteCategories() {
        long categoryId = createCategory("Work", "#2563EB");

        given()
                .when()
                .get("/categories")
                .then()
                .statusCode(200)
                .body("id", hasItem((int) categoryId));

        given()
                .contentType(ContentType.JSON)
                .body("{\"name\":\"Office\",\"colour\":\"#1D4ED8\"}")
                .when()
                .patch("/categories/{id}", categoryId)
                .then()
                .statusCode(200)
                .body("id", equalTo((int) categoryId))
                .body("name", equalTo("Office"));

        given()
                .when()
                .delete("/categories/{id}", categoryId)
                .then()
                .statusCode(204);

        given()
                .when()
                .get("/categories")
                .then()
                .statusCode(200)
                .body("id", not(hasItem((int) categoryId)));
    }

    @Test
    void todoEndpointsCreateRetrieveFilterUpdateAndCompleteTodos() {
        long categoryId = createCategory("Study", "#9333EA");
        long todoId = createTodo(categoryId, "2026-12-01T09:00:00");

        given()
                .when()
                .get("/todos/{id}", todoId)
                .then()
                .statusCode(200)
                .body("id", equalTo((int) todoId))
                .body("categoryId", equalTo((int) categoryId))
                .body("isDone", equalTo(false));

        given()
                .queryParam("category", categoryId)
                .when()
                .get("/todos")
                .then()
                .statusCode(200)
                .body("id", hasItem((int) todoId));

        given()
                .contentType(ContentType.JSON)
                .body("{\"dueAt\":\"2026-12-02T10:30:00\"}")
                .when()
                .patch("/todos/{id}", todoId)
                .then()
                .statusCode(200)
                .body("dueAt", equalTo("2026-12-02T10:30:00"));

        given()
                .when()
                .get("/todos/{id}/done", todoId)
                .then()
                .statusCode(200)
                .body("isDone", equalTo(true));
    }

    @Test
    void todoEndpointsSoftDeleteAndPermanentlyDeleteSingleTodos() {
        long categoryId = createCategory("Personal", "#16A34A");
        long todoId = createTodo(categoryId, "2026-12-03T10:00:00");

        given()
                .when()
                .delete("/todos/{id}", todoId)
                .then()
                .statusCode(204);

        given()
                .when()
                .get("/todos/deleted")
                .then()
                .statusCode(200)
                .body("id", hasItem((int) todoId));

        given()
                .when()
                .delete("/todos/deleted/{id}", todoId)
                .then()
                .statusCode(204);

        given()
                .when()
                .get("/todos/{id}", todoId)
                .then()
                .statusCode(404);
    }

    @Test
    void todoEndpointsDeleteAllDoneAndAllSoftDeletedTodos() {
        long categoryId = createCategory("Shopping", "#EA580C");
        long firstTodoId = createTodo(categoryId, "2026-12-04T10:00:00");
        long secondTodoId = createTodo(categoryId, "2026-12-05T10:00:00");

        given().when().get("/todos/{id}/done", firstTodoId).then().statusCode(200);
        given().when().get("/todos/{id}/done", secondTodoId).then().statusCode(200);

        given()
                .when()
                .delete("/todos/done")
                .then()
                .statusCode(204);

        given()
                .when()
                .get("/todos/deleted")
                .then()
                .statusCode(200)
                .body("id", hasItem((int) firstTodoId))
                .body("id", hasItem((int) secondTodoId));

        given()
                .when()
                .delete("/todos/deleted")
                .then()
                .statusCode(204);

        given()
                .when()
                .get("/todos/deleted")
                .then()
                .statusCode(200)
                .body("id", not(hasItem((int) firstTodoId)))
                .body("id", not(hasItem((int) secondTodoId)));
    }

    private long createCategory(String name, String colour) {
        return given()
                .contentType(ContentType.JSON)
                .body("{\"name\":\"" + name + "\",\"colour\":\"" + colour + "\"}")
                .when()
                .post("/categories")
                .then()
                .statusCode(201)
                .extract()
                .jsonPath()
                .getLong("id");
    }

    private long createTodo(long categoryId, String dueAt) {
        return given()
                .contentType(ContentType.JSON)
                .body("{\"dueAt\":\"" + dueAt + "\",\"categoryId\":" + categoryId + "}")
                .when()
                .post("/todos")
                .then()
                .statusCode(201)
                .extract()
                .jsonPath()
                .getLong("id");
    }
}
