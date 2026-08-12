package com.nology.todoapi.category.dtos;

public record CategoryRequest(String name, String colour) {
    public String getName() {
        return name;
    }

    public String getColour() {
        return colour;
    }
}
