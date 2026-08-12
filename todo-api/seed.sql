-- Run this after dbsetup.sql to add demo data.

INSERT INTO todo_app.categories (id, name, colour, is_achived) VALUES
    (1, 'Work', '#2563EB', FALSE),
    (2, 'Personal', '#16A34A', FALSE),
    (3, 'Study', '#9333EA', FALSE),
    (4, 'Shopping', '#EA580C', TRUE);

INSERT INTO todo_app.todos (created_at, due_at, category_id, is_done, is_achived) VALUES
    ('2026-08-10 09:00:00', '2026-08-13 17:00:00', 1, FALSE, FALSE),
    ('2026-08-11 18:30:00', '2026-08-14 09:00:00', 2, TRUE, FALSE),
    ('2026-08-12 10:15:00', '2026-08-18 23:59:00', 3, FALSE, FALSE),
    ('2026-08-12 12:00:00', '2026-08-12 18:00:00', 4, TRUE, TRUE),
    ('2026-08-12 14:45:00', NULL, 2, FALSE, FALSE);
