
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

    // Borrow a book by Member
    @PostMapping("/{bookId}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<BorrowRecordResponseDTO> borrowBook(
            @PathVariable Long bookId,
            Authentication authentication) {

        BorrowRecordResponseDTO response = borrowRecordService.borrowBook(bookId, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Return a borrowed book by Member
    @PutMapping("/{borrowId}/return")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<BorrowRecordResponseDTO> returnBook(
            @PathVariable Long borrowId,
            Authentication authentication) {

        BorrowRecordResponseDTO response = borrowRecordService.returnBook(borrowId, authentication.getName());

        return ResponseEntity.ok(response);
    }

    // View logged-in Member's borrowing history
    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getMyBorrowingHistory(
            Authentication authentication) {

        List<BorrowRecordResponseDTO> history = borrowRecordService.getMyBorrowingHistory(authentication.getName());

        return ResponseEntity.ok(history);
    }

    // View all overdue books
    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getAllOverdueBooks() {

        List<BorrowRecordResponseDTO> overdueBooks = borrowRecordService.getAllOverdueBooks();

        return ResponseEntity.ok(overdueBooks);
    }

    // View logged-in Member's overdue books
    @GetMapping("/my/overdue")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getMyOverdueBooks(
            Authentication authentication) {

        List<BorrowRecordResponseDTO> overdueBooks = borrowRecordService.getMyOverdueBooks(authentication.getName());

        return ResponseEntity.ok(overdueBooks);
    }

    // Issue a book to a Member by Librarian
    @PostMapping("/{bookId}/issue/{memberId}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<BorrowRecordResponseDTO> issueBookToMember(
            @PathVariable Long bookId,
            @PathVariable Long memberId) {

        BorrowRecordResponseDTO response = borrowRecordService.borrowBookForMember(bookId, memberId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // View pending borrowing requests
    @GetMapping("/borrow-requests")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getPendingBorrowRequests() {

        return ResponseEntity.ok(
                borrowRecordService.getPendingBorrowRequests());
    }

    // Confirm and issue a pending borrowing request
    @PutMapping("/{borrowId}/issue")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<BorrowRecordResponseDTO> confirmBorrowRequest(
            @PathVariable Long borrowId) {

        return ResponseEntity.ok(
                borrowRecordService.issuePendingBorrowRequest(borrowId));
    }

    // View all borrowing records
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getAllBorrowings() {

        return ResponseEntity.ok(borrowRecordService.getAllBorrowings());
    }

    // Return a borrowed book by Librarian
    @PutMapping("/{borrowId}/return/librarian")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<BorrowRecordResponseDTO> returnBookByLibrarian(
            @PathVariable Long borrowId) {

        BorrowRecordResponseDTO response = borrowRecordService.returnBookForLibrarian(borrowId);

        return ResponseEntity.ok(response);
    }

    // View pending return requests
    @GetMapping("/return-requests")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<BorrowRecordResponseDTO>> getPendingReturnRequests() {

        return ResponseEntity.ok(
                borrowRecordService.getPendingReturnRequests());
    }
}
