package com.library.management.controller;

import com.library.management.dto.BookDeleteRequestResponseDTO;
import com.library.management.entity.DeleteRequestStatus;
import com.library.management.repository.BookDeleteRequestRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.library.management.dto.BookDeleteReviewDTO;
import com.library.management.service.BookDeleteRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/admin/book-delete-requests")
@RequiredArgsConstructor
public class AdminBookDeleteRequestController {

        private final BookDeleteRequestRepository requestRepository;
        private final BookDeleteRequestService bookDeleteRequestService;

        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<BookDeleteRequestResponseDTO>> getPendingRequests() {

                List<BookDeleteRequestResponseDTO> requests = requestRepository.findByStatusOrderByRequestedAtDesc(
                                DeleteRequestStatus.PENDING).stream()
                                .map(request -> new BookDeleteRequestResponseDTO(
                                                request.getId(),
                                                request.getRequestedBookId(),
                                                request.getBookTitle(),
                                                request.getIsbn(),
                                                request.getRequestedBy().getName(),
                                                request.getRequestedBy().getEmail(),
                                                request.getReason(),
                                                request.getStatus(),
                                                request.getRequestedAt(),
                                                request.getReviewedBy() != null
                                                                ? request.getReviewedBy().getName()
                                                                : null,
                                                request.getReviewedAt()))
                                .toList();

                return ResponseEntity.ok(requests);
        }

        @GetMapping("/all")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<BookDeleteRequestResponseDTO>> getAllRequests() {

                List<BookDeleteRequestResponseDTO> requests = requestRepository.findAll().stream()
                                .map(request -> new BookDeleteRequestResponseDTO(
                                                request.getId(),
                                                request.getRequestedBookId(),
                                                request.getBookTitle(),
                                                request.getIsbn(),
                                                request.getRequestedBy().getName(),
                                                request.getRequestedBy().getEmail(),
                                                request.getReason(),
                                                request.getStatus(),
                                                request.getRequestedAt(),
                                                request.getReviewedBy() != null
                                                                ? request.getReviewedBy().getName()
                                                                : null,
                                                request.getReviewedAt()))
                                .toList();

                return ResponseEntity.ok(requests);
        }

        @PatchMapping("/{requestId}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Map<String, String>> reviewRequest(
                        @PathVariable Long requestId,
                        @Valid @RequestBody BookDeleteReviewDTO review) {

                bookDeleteRequestService.reviewDeletionRequest(requestId, review);

                return ResponseEntity.ok(
                                Map.of("message", "Deletion request reviewed successfully"));
        }
}