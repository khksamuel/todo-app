package com.nology.todoapi.category;

import com.nology.todoapi.category.entities.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.isAchived = false")
    List<Category> findAllActive();

    @Query("SELECT c FROM Category c WHERE c.id = :id AND c.isAchived = false")
    java.util.Optional<Category> findActiveById(Long id);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Category c WHERE c.name = :name AND c.isAchived = false")
    boolean existsByName(String name);
}
