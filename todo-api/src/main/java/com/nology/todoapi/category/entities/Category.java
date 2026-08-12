package com.nology.todoapi.category.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories", schema = "todo_app")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 7)
    private String colour;

    @Column(name = "is_achived", nullable = false)
    private boolean isAchived = false;

    protected Category() {
        // Required by JPA.
    }

    public Category(String name, String colour) {
        this.name = name;
        this.colour = colour;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public boolean isAchived() {
        return isAchived;
    }

    public void setAchived(boolean achived) {
        isAchived = achived;
    }
}
