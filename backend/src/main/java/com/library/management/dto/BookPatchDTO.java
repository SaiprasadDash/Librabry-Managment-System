
package com.library.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record BookPatchDTO(

        @Size(max = 255, message = "Title cannot exceed 255 characters") String title,

        @Size(max = 20, message = "ISBN cannot exceed 20 characters") String isbn,

        String description,

        @Size(max = 150, message = "Publisher cannot exceed 150 characters") String publisher,

        @Min(value = 1450, message = "Invalid publication year") Integer publishedYear,

        @Min(value = 1, message = "At least one copy is required") Integer totalCopies

) {
}
