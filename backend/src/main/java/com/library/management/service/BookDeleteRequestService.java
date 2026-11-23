
package com.library.management.service;

import com.library.management.dto.BookDeleteRequestDTO;
import com.library.management.entity.Book;
import com.library.management.entity.BookDeleteRequest;
import com.library.management.entity.DeleteRequestStatus;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookDeleteRequestRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.UserRepository;
import com.library.management.dto.BookDeleteReviewDTO;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookDeleteRequestService {

        private final BookDeleteRequestRepository requestRepository;
        private final BookRepository bookRepository;
        private final UserRepository userRepository;
        private final BookService bookService;

        @Transactional
        public void requestBookDeletion(
                        Long bookId,
                        BookDeleteRequestDTO request) {

                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Book not found with ID: " + bookId));

                if (requestRepository.existsByBookIdAndStatus(
                                bookId, DeleteRequestStatus.PENDING)) {
                        throw new IllegalStateException(
                                        "A pending deletion request already exists for this book.");
                }

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                User librarian = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Logged-in user not found"));

                BookDeleteRequest deleteRequest = new BookDeleteRequest();
                deleteRequest.setBook(book);
                deleteRequest.setRequestedBookId(book.getId());
                deleteRequest.setBookTitle(book.getTitle());
                deleteRequest.setIsbn(book.getIsbn());

                deleteRequest.setRequestedBy(librarian);
                deleteRequest.setReason(request.reason());
                deleteRequest.setStatus(DeleteRequestStatus.PENDING);

                requestRepository.save(deleteRequest);
        }

        @Transactional
        public void reviewDeletionRequest(Long requestId, BookDeleteReviewDTO review) {

                BookDeleteRequest deleteRequest = requestRepository.findById(requestId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Deletion request not found with ID: " + requestId));

                if (deleteRequest.getStatus() != DeleteRequestStatus.PENDING) {
                        throw new IllegalStateException(
                                        "This deletion request has already been reviewed.");
                }

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                User admin = userRepository.findByEmail(authentication.getName())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Logged-in admin not found"));

                if (review.status() == DeleteRequestStatus.APPROVED) {

                        Long bookId = deleteRequest.getRequestedBookId();

                        // Remove the book relationship from request history.
                        requestRepository.detachBookReferences(bookId);

                        // Reuse the existing deletion method and its safety checks.
                        bookService.deleteBook(bookId);

                        deleteRequest.setBook(null);

                } else if (review.status() == DeleteRequestStatus.REJECTED) {

                        // Keep the book. Only update the request status.

                } else {
                        throw new IllegalArgumentException(
                                        "Only APPROVED or REJECTED status is allowed.");
                }

                deleteRequest.setStatus(review.status());
                deleteRequest.setReviewedBy(admin);
                deleteRequest.setReviewedAt(LocalDateTime.now());

                requestRepository.save(deleteRequest);
        }
}
