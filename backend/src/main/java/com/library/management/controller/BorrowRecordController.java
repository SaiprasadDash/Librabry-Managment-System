package com.library.management.controller;

import com.library.management.dto.BorrowRecordResponseDTO;
import com.library.management.service.BorrowRecordService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
public class BorrowRecordController {

    private final BorrowRecordService borrowRecordService;

    // Borrow a book
    @PostMapping("/{bookId}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<BorrowRecordResponseDTO> borrowBook(
            @PathVariable Long bookId,
            Authentication authentication) {

        BorrowRecordResponseDTO response = borrowRecordService.borrowBook(bookId, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Return a borrowed book
    @PutMapping("/{borrowId}/return")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<BorrowRecordResponseDTO> returnBook(
            @PathVariable Long borrowId,
            Authentication authentication) {

        BorrowRecordResponseDTO response = borrowRecordService.returnBook(borrowId, authentication.getName());

        return ResponseEntity.ok(response);
    }

    // View logged-in member's borrowing history
    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getMyBorrowingHistory(
            Authentication authentication) {

        List<BorrowRecordResponseDTO> history = borrowRecordService.getMyBorrowingHistory(authentication.getName());

        return ResponseEntity.ok(history);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getAllOverdueBooks() {
        List<BorrowRecordResponseDTO> overdueBooks = borrowRecordService.getAllOverdueBooks();

        return ResponseEntity.ok(overdueBooks);
    }

    @GetMapping("/my/overdue")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getMyOverdueBooks(
            Authentication authentication) {

        List<BorrowRecordResponseDTO> overdueBooks = borrowRecordService.getMyOverdueBooks(authentication.getName());

        return ResponseEntity.ok(overdueBooks);
    }
}