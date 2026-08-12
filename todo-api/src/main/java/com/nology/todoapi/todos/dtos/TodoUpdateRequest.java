package com.nology.todoapi.todos.dtos;

import java.time.LocalDateTime;

public record TodoUpdateRequest(String name, String description, LocalDateTime dueAt, Long categoryId) {
}
