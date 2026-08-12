package com.nology.todoapi.category;

import com.nology.todoapi.category.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
