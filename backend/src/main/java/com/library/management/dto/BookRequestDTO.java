
package com.library.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record BookRequestDTO(

                @NotBlank(message = "Book title is required") @Size(max = 255, message = "Title cannot exceed 255 characters") String title,

                @NotBlank(message = "ISBN is required") @Size(max = 20, message = "ISBN cannot exceed 20 characters") String isbn,

                String description,

                @Size(max = 150, message = "Publisher cannot exceed 150 characters") String publisher,

                @Min(value = 1450, message = "Invalid publication year") Integer publishedYear,

                @NotNull(message = "Total copies are required") @Min(value = 1, message = "At least one copy is required") Integer totalCopies,

                Set<Long> authorIds,

                Set<Long> categoryIds

) {
}
