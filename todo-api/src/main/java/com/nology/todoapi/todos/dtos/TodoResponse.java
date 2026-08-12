package com.nology.todoapi.todos.dtos;

import java.time.LocalDateTime;

public record TodoResponse(
        Long id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime dueAt,
        Long categoryId,
        String categoryName,
        String categoryColour,
        boolean isDone
) {
}
