package com.library.management.dto;

import com.library.management.entity.DeleteRequestStatus;
import java.time.LocalDateTime;

public record BookDeleteRequestResponseDTO(
        Long id,
        Long bookId,
        String bookTitle,
        String isbn,
        String librarianName,
        String librarianEmail,
        String reason,
        DeleteRequestStatus status,
        LocalDateTime requestedAt,
        String reviewedBy,
        LocalDateTime reviewedAt) {
}