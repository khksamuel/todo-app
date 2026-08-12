package com.nology.todoapi.todos;

import com.nology.todoapi.todos.entities.Todo;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TodosRepository extends JpaRepository<Todo, Long> {

    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t")
    List<Todo> findAllWithCategory();
}
