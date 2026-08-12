package com.nology.todoapi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfiguration {

    @Bean
    ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    OpenAPI todoApiOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Todo API")
                .version("v1")
                .description("API for managing todo items and categories."));
    }
}
