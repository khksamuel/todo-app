CREATE TABLE todo_app.categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    colour CHAR(7) NOT NULL
);

CREATE TABLE todo_app.todos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at DATETIME NULL,
    category_id BIGINT UNSIGNED NULL,
    CONSTRAINT fk_todos_category
        FOREIGN KEY (category_id)
        REFERENCES todo_app.categories (id)
        ON DELETE SET NULL
);
