
package com.library.management.dto;

import java.time.LocalDateTime;

public record BookResponseDTO(

        Long id,
        String title,
        String isbn,
        String description,
        String publisher,
        Integer publishedYear,
        Integer totalCopies,
        Integer availableCopies,
        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {
}
