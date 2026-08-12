package com.nology.todoapi.todos.dtos;

import java.time.LocalDateTime;

public record TodoRequest(LocalDateTime dueAt, Long categoryId) {
}
