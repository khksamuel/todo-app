package com.nology.todoapi.todos.dtos;

import java.time.LocalDateTime;

public record TodoRequest(String name, String description, LocalDateTime dueAt, Long categoryId) {
}
