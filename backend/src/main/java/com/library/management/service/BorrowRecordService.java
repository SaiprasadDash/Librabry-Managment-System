package com.library.management.service;

import com.library.management.dto.BorrowRecordResponseDTO;
import com.library.management.entity.Book;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.BorrowStatus;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowRecordService {

        private final BorrowRecordRepository borrowRecordRepository;
        private final BookRepository bookRepository;
        private final UserRepository userRepository;
        private final FineCalculationService fineCalculationService;

        private static final int BORROW_DAYS = 14;

        @Transactional
        public BorrowRecordResponseDTO borrowBook(Long bookId, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

                if (book.getAvailableCopies() <= 0) {
                        throw new IllegalStateException("No copies of this book are currently available");
                }

                boolean alreadyBorrowed = borrowRecordRepository
                                .existsByUserIdAndBookIdAndStatus(
                                                user.getId(), bookId, BorrowStatus.BORROWED);

                if (alreadyBorrowed) {
                        throw new IllegalStateException("You have already borrowed this book");
                }

                BorrowRecord record = new BorrowRecord();

                record.setUser(user);
                record.setBook(book);
                record.setBorrowDate(LocalDate.now());
                record.setDueDate(LocalDate.now().plusDays(BORROW_DAYS));
                record.setStatus(BorrowStatus.BORROWED);

                book.setAvailableCopies(book.getAvailableCopies() - 1);

                bookRepository.save(book);

                BorrowRecord savedRecord = borrowRecordRepository.save(record);

                return mapToResponse(savedRecord);
        }

        @Transactional
        public BorrowRecordResponseDTO returnBook(Long borrowId, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                BorrowRecord record = borrowRecordRepository.findById(borrowId)
                                .orElseThrow(() -> new ResourceNotFoundException("Borrowing record not found"));

                if (!record.getUser().getId().equals(user.getId())) {
                        throw new IllegalStateException("You cannot return another user's book");
                }

                if (record.getStatus() == BorrowStatus.RETURNED) {
                        throw new IllegalStateException("This book has already been returned");
                }

                record.setReturnDate(LocalDate.now());
                record.setStatus(BorrowStatus.RETURNED);

                Book book = record.getBook();
                book.setAvailableCopies(book.getAvailableCopies() + 1);

                bookRepository.save(book);

                BorrowRecord savedRecord = borrowRecordRepository.save(record);

                return mapToResponse(savedRecord);
        }

        @Transactional(readOnly = true)
        public List<BorrowRecordResponseDTO> getMyBorrowingHistory(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return borrowRecordRepository.findByUserId(user.getId())
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        private BorrowRecordResponseDTO mapToResponse(BorrowRecord record) {

                return new BorrowRecordResponseDTO(
                                record.getId(),
                                record.getBook().getId(),
                                record.getBook().getTitle(),
                                record.getBook().getIsbn(),
                                record.getUser().getId(),
                                record.getUser().getName(),
                                record.getUser().getEmail(),
                                record.getBorrowDate(),
                                record.getDueDate(),
                                record.getReturnDate(),
                                record.getStatus(),
                                fineCalculationService.calculateFine(record));
        }

        @Transactional(readOnly = true)
        public List<BorrowRecordResponseDTO> getAllOverdueBooks() {
                return borrowRecordRepository
                                .findByStatusAndDueDateBefore(BorrowStatus.BORROWED, LocalDate.now())
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<BorrowRecordResponseDTO> getMyOverdueBooks(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return borrowRecordRepository
                                .findByUserIdAndStatusAndDueDateBefore(
                                                user.getId(), BorrowStatus.BORROWED, LocalDate.now())
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }
}