package com.nology.todoapi.todos.dtos;

import java.time.LocalDateTime;

public record TodoResponse(
        Long id,
        LocalDateTime createdAt,
        LocalDateTime dueAt,
        Long categoryId,
        String categoryName,
        boolean isDone
) {
}
