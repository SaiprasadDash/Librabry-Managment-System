
package com.library.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequestDTO(

        @NotBlank(message = "Category name is required") @Size(max = 100, message = "Category name cannot exceed 100 characters") String name,

        String description

) {
}
