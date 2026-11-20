package com.library.management.dto;

import com.library.management.entity.ReservationStatus;
import java.time.LocalDateTime;

public record ReservationResponseDTO(
        Long id,
        Long bookId,
        String bookTitle,
        Long userId,
        String userName,
        String userEmail,
        ReservationStatus status,
        LocalDateTime reservationDate) {
}