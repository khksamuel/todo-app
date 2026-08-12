package com.nology.todoapi.category;

import com.nology.todoapi.category.dtos.CategoryRequest;
import com.nology.todoapi.category.dtos.CategoryResponse;
import com.nology.todoapi.category.dtos.CategoryUpdateRequest;
import com.nology.todoapi.category.entities.Category;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAllActive().stream().map(this::toResponse).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        return toResponse(categoryRepository.save(new Category(request.name(), request.colour())));
    }

    public CategoryResponse update(Long id, CategoryUpdateRequest request) {
        Category category = findActive(id);
        if (request.name() != null) category.setName(request.name());
        if (request.colour() != null) category.setColour(request.colour());
        return toResponse(categoryRepository.save(category));
    }

    public void softDelete(Long id) {
        Category category = findActive(id);
        category.setAchived(true);
        categoryRepository.save(category);
    }

    private Category findActive(Long id) {
        return categoryRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getColour());
    }
}
