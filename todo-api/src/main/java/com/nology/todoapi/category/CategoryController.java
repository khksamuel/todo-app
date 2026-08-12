package com.nology.todoapi.category;

import com.nology.todoapi.category.dtos.CategoryRequest;
import com.nology.todoapi.category.dtos.CategoryResponse;
import com.nology.todoapi.category.dtos.CategoryUpdateRequest;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getCategories() {
        return categoryService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(@RequestBody CategoryRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Category name cannot be null or blank");
        }
        if (request.getColour() == null || request.getColour().isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Category colour cannot be null or blank");
        }

        // if name already exist 
        if (categoryService.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category with name '" + request.getName() + "' already exists");
        }

        return categoryService.create(request);
    }

    @PatchMapping("/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @RequestBody CategoryUpdateRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        categoryService.softDelete(id);
    }
}
