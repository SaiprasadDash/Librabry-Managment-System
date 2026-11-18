package com.library.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthorRequestDTO(

        @NotBlank(message = "Author name is required") @Size(max = 150, message = "Author name cannot exceed 150 characters") String name,

        String biography

) {
}