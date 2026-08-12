package com.nology.todoapi.todos;

import com.nology.todoapi.todos.dtos.TodoRequest;
import com.nology.todoapi.todos.dtos.TodoResponse;
import com.nology.todoapi.todos.dtos.TodoUpdateRequest;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/todos")
public class TodosController {

    private final TodosService todosService;

    public TodosController(TodosService todosService) {
        this.todosService = todosService;
    }

    @GetMapping
    public List<TodoResponse> getTodos(@RequestParam(required = false) Long category) {
        return todosService.findAll(category);
    }

    @GetMapping("/{id}")
    public TodoResponse getTodo(@PathVariable Long id) {
        return todosService.findById(id);
    }

    @GetMapping("/deleted")
    public List<TodoResponse> getDeletedTodos() {
        return todosService.findAllDeleted();
    }

    @GetMapping("/{id}/done")
    public TodoResponse markTodoDone(@PathVariable Long id) {
        return todosService.markDone(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TodoResponse createTodo(@RequestBody TodoRequest request) {
        return todosService.create(request);
    }

    @PatchMapping("/{id}")
    public TodoResponse updateTodo(@PathVariable Long id, @RequestBody TodoUpdateRequest request) {
        return todosService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTodo(@PathVariable Long id) {
        todosService.softDelete(id);
    }

    @DeleteMapping("/done/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDoneTodo(@PathVariable Long id) {
        todosService.softDeleteDone(id);
    }

    @DeleteMapping("/done")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAllDoneTodos() {
        todosService.softDeleteAllDone();
    }

    @DeleteMapping("/{id}/permanent")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void permanentlyDeleteTodo(@PathVariable Long id) {
        todosService.hardDelete(id);
    }

    @DeleteMapping("/deleted/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void permanentlyDeleteDeletedTodo(@PathVariable Long id) {
        todosService.hardDelete(id);
    }

    @DeleteMapping("/deleted")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void permanentlyDeleteAllDeletedTodos() {
        todosService.hardDeleteAllDeleted();
    }
}
