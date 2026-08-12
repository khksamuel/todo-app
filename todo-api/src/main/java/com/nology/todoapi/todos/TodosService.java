package com.nology.todoapi.todos;

import com.nology.todoapi.category.CategoryRepository;
import com.nology.todoapi.category.entities.Category;
import com.nology.todoapi.todos.dtos.TodoRequest;
import com.nology.todoapi.todos.dtos.TodoResponse;
import com.nology.todoapi.todos.dtos.TodoUpdateRequest;
import com.nology.todoapi.todos.entities.Todo;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class TodosService {

    private final TodosRepository todosRepository;
    private final CategoryRepository categoryRepository;

    public TodosService(TodosRepository todosRepository, CategoryRepository categoryRepository) {
        this.todosRepository = todosRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TodoResponse> findAll(Long categoryId) {
        List<Todo> todos = categoryId == null
                ? todosRepository.findAllWithCategory()
                : todosRepository.findAllActiveByCategoryId(categoryId);
        return todos.stream().map(this::toResponse).toList();
    }

    public TodoResponse findById(Long id) {
        return toResponse(findActive(id));
    }

    public List<TodoResponse> findAllDeleted() {
        return todosRepository.findAllDeletedWithCategory().stream().map(this::toResponse).toList();
    }

    public TodoResponse create(TodoRequest request) {
        Category category = request.categoryId() == null ? null : findCategory(request.categoryId());
        return toResponse(todosRepository.save(new Todo(request.dueAt(), category)));
    }

    public TodoResponse update(Long id, TodoUpdateRequest request) {
        Todo todo = findActive(id);
        if (request.dueAt() != null) todo.setDueAt(request.dueAt());
        if (request.categoryId() != null) todo.setCategory(findCategory(request.categoryId()));
        return toResponse(todosRepository.save(todo));
    }

    public void softDelete(Long id) {
        Todo todo = findActive(id);
        todo.setAchived(true);
        todosRepository.save(todo);
    }

    public void softDeleteDone(Long id) {
        Todo todo = findActive(id);
        if (!todo.isDone()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Todo is not done");
        }
        todo.setAchived(true);
        todosRepository.save(todo);
    }

    public void softDeleteAllDone() {
        List<Todo> doneTodos = todosRepository.findAllActiveDone();
        doneTodos.forEach(todo -> todo.setAchived(true));
        todosRepository.saveAll(doneTodos);
    }

    public TodoResponse markDone(Long id) {
        Todo todo = findActive(id);
        todo.setDone(true);
        return toResponse(todosRepository.save(todo));
    }

    public void hardDelete(Long id) {
        Todo todo = todosRepository.findDeletedByIdWithCategory(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deleted todo not found"));
        todosRepository.delete(todo);
    }

    public void hardDeleteAllDeleted() {
        todosRepository.deleteAll(todosRepository.findAllDeletedWithCategory());
    }

    private Todo findActive(Long id) {
        return todosRepository.findActiveByIdWithCategory(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found"));
    }

    private Category findCategory(Long id) {
        return categoryRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));
    }

    private TodoResponse toResponse(Todo todo) {
        Long categoryId = todo.getCategory() == null ? null : todo.getCategory().getId();
        String categoryName = todo.getCategory() == null ? null : todo.getCategory().getName();
        return new TodoResponse(todo.getId(), todo.getCreatedAt(), todo.getDueAt(), categoryId, categoryName, todo.isDone());
    }
}
