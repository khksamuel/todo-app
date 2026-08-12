package com.nology.todoapi.todos;

import com.nology.todoapi.todos.entities.Todo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TodosRepository extends JpaRepository<Todo, Long> {

    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t WHERE t.isAchived = false")
    List<Todo> findAllWithCategory();

    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t WHERE t.id = :id AND t.isAchived = false")
    Optional<Todo> findActiveByIdWithCategory(Long id);

    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t WHERE t.category.id = :categoryId AND t.isAchived = false")
    List<Todo> findAllActiveByCategoryId(Long categoryId);

    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t WHERE t.isAchived = true")
    List<Todo> findAllDeletedWithCategory();

    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t WHERE t.id = :id AND t.isAchived = true")
    Optional<Todo> findDeletedByIdWithCategory(Long id);

    @Query("SELECT t FROM Todo t WHERE t.isDone = true AND t.isAchived = false")
    List<Todo> findAllActiveDone();
}
