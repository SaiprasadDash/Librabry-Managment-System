package com.library.management.dto;

import com.library.management.entity.BorrowStatus;
import java.time.LocalDate;

public record BorrowRecordResponseDTO(
                Long id,
                Long bookId,
                String bookTitle,
                String isbn,
                Long userId,
                String userName,
                String userEmail,
                LocalDate borrowDate,
                LocalDate dueDate,
                LocalDate returnDate,
                BorrowStatus status,
                Double fineAmount) {
}