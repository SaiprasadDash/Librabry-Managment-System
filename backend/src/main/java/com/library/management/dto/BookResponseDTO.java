
package com.library.management.dto;

import java.time.LocalDateTime;
import java.util.Set;

public record BookResponseDTO(

                Long id,
                String title,
                String isbn,
                String description,
                String publisher,
                Integer publishedYear,
                Integer totalCopies,
                Integer availableCopies,

                Set<AuthorResponseDTO> authors,
                Set<CategoryResponseDTO> categories,

                LocalDateTime createdAt,
                LocalDateTime updatedAt

) {
}
