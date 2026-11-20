package com.library.management.dto;

public record ReservationCountResponseDTO(
        Long bookId,
        String bookTitle,
        long waitingReservationCount) {
}