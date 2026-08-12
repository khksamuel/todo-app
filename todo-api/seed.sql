-- Run this after dbsetup.sql to replace all existing todo_app demo data.
-- This deletes every todo and category in the schema before inserting the data below.

DELETE FROM todo_app.todos;
DELETE FROM todo_app.categories;

ALTER TABLE todo_app.todos AUTO_INCREMENT = 1;
ALTER TABLE todo_app.categories AUTO_INCREMENT = 1;

INSERT INTO todo_app.categories (id, name, colour, is_achived) VALUES
    (1, 'Work', '#2563EB', FALSE),
    (2, 'Personal', '#16A34A', FALSE),
    (3, 'Study', '#9333EA', FALSE),
    (4, 'Shopping', '#EA580C', TRUE);

INSERT INTO todo_app.todos (name, description, created_at, due_at, category_id, is_done, is_achived) VALUES
    ('Prepare project update', 'Summarise this week’s progress for the team.', '2026-08-10 09:00:00', '2026-08-13 17:00:00', 1, FALSE, FALSE),
    ('Book dentist appointment', 'Call the clinic to schedule a check-up.', '2026-08-11 18:30:00', '2026-08-14 09:00:00', 2, TRUE, FALSE),
    ('Complete Java revision', 'Review JPA repositories and service-layer patterns.', '2026-08-12 10:15:00', '2026-08-18 23:59:00', 3, FALSE, FALSE),
    ('Buy groceries', 'Milk, bread, fruit, and coffee.', '2026-08-12 12:00:00', '2026-08-12 18:00:00', 4, TRUE, TRUE),
    ('Plan weekend walk', NULL, '2026-08-12 14:45:00', NULL, 2, FALSE, FALSE);
