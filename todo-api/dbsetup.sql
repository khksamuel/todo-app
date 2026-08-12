CREATE SCHEMA IF NOT EXISTS todo_app;

CREATE TABLE IF NOT EXISTS todo_app.categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    colour CHAR(7) NOT NULL,
    is_achived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS todo_app.todos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at DATETIME NULL,
    category_id BIGINT UNSIGNED NULL,
    is_achived BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_todos_category
        FOREIGN KEY (category_id)
        REFERENCES todo_app.categories (id)
        ON DELETE SET NULL
);

-- Add the soft-deletion flag when upgrading an existing database.
-- The information_schema checks make this safe to run more than once.
SET @categories_has_is_achived = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = 'todo_app'
      AND table_name = 'categories'
      AND column_name = 'is_achived'
);
SET @categories_sql = IF(
    @categories_has_is_achived = 0,
    'ALTER TABLE todo_app.categories ADD COLUMN is_achived BOOLEAN NOT NULL DEFAULT FALSE',
    'SELECT 1'
);
PREPARE categories_statement FROM @categories_sql;
EXECUTE categories_statement;
DEALLOCATE PREPARE categories_statement;

SET @todos_has_is_achived = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = 'todo_app'
      AND table_name = 'todos'
      AND column_name = 'is_achived'
);
SET @todos_sql = IF(
    @todos_has_is_achived = 0,
    'ALTER TABLE todo_app.todos ADD COLUMN is_achived BOOLEAN NOT NULL DEFAULT FALSE',
    'SELECT 1'
);
PREPARE todos_statement FROM @todos_sql;
EXECUTE todos_statement;
DEALLOCATE PREPARE todos_statement;
