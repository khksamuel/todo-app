package com.nology.todoapi.todos.dtos;

import java.time.LocalDateTime;

public record TodoUpdateRequest(LocalDateTime dueAt, Long categoryId) {
}
