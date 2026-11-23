package com.library.management.service;

import com.library.management.dto.BorrowRecordResponseDTO;
import com.library.management.dto.ReservationResponseDTO;
import com.library.management.entity.Book;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.BorrowStatus;
import com.library.management.entity.Reservation;
import com.library.management.entity.ReservationStatus;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowRecordService {

        private final BorrowRecordRepository borrowRecordRepository;
        private final BookRepository bookRepository;
        private final UserRepository userRepository;
        private final ReservationRepository reservationRepository;
        private final FineCalculationService fineCalculationService;
        private final ReservationService reservationService;

        private static final int BORROW_DAYS = 14;

        @Transactional
        public BorrowRecordResponseDTO borrowBook(Long bookId, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Book book = bookRepository.findByIdForUpdate(bookId)
                                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

                boolean alreadyBorrowed = borrowRecordRepository
                                .existsByUserIdAndBookIdAndStatus(user.getId(), bookId, BorrowStatus.BORROWED);

                boolean requestPending = borrowRecordRepository
                                .existsByUserIdAndBookIdAndStatus(user.getId(), bookId, BorrowStatus.BORROW_PENDING);

                boolean returnPending = borrowRecordRepository
                                .existsByUserIdAndBookIdAndStatus(user.getId(), bookId, BorrowStatus.RETURN_PENDING);

                if (alreadyBorrowed || requestPending || returnPending) {
                        throw new IllegalStateException(
                                        "You have already borrowed this book or have a pending borrow request");
                }

                Optional<Reservation> readyReservation = reservationRepository
                                .findByBookIdAndUserIdAndStatus(
                                                bookId, user.getId(), ReservationStatus.READY_FOR_PICKUP);

                boolean isReservedBook = readyReservation.isPresent();

                if (!isReservedBook && book.getAvailableCopies() <= 0) {
                        throw new IllegalStateException("No copies of this book are currently available");
                }

                BorrowRecord record = new BorrowRecord();

                record.setUser(user);
                record.setBook(book);
                record.setBorrowDate(null);
                record.setDueDate(null);
                record.setReturnDate(null);
                record.setStatus(BorrowStatus.BORROW_PENDING);

                BorrowRecord savedRecord = borrowRecordRepository.save(record);

                return mapToResponse(savedRecord);
        }

        @Transactional
        public BorrowRecordResponseDTO borrowBookForMember(Long bookId, Long memberId) {

                User member = userRepository.findById(memberId)
                                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

                if (member.getRole() != com.library.management.entity.Role.MEMBER) {
                        throw new IllegalStateException("Selected user is not a member");
                }

                return borrowBook(bookId, member.getEmail());
        }

        @Transactional
        public BorrowRecordResponseDTO issuePendingBorrowRequest(Long borrowId) {

                BorrowRecord record = borrowRecordRepository.findById(borrowId)
                                .orElseThrow(() -> new ResourceNotFoundException("Borrowing request not found"));

                if (record.getStatus() != BorrowStatus.BORROW_PENDING) {
                        throw new IllegalStateException("This borrowing request is not pending");
                }

                Book book = bookRepository.findByIdForUpdate(record.getBook().getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

                Optional<Reservation> readyReservation = reservationRepository
                                .findByBookIdAndUserIdAndStatus(
                                                book.getId(),
                                                record.getUser().getId(),
                                                ReservationStatus.READY_FOR_PICKUP);

                if (readyReservation.isPresent()) {
                        Reservation reservation = readyReservation.get();
                        reservation.setStatus(ReservationStatus.FULFILLED);
                        reservationRepository.save(reservation);
                } else {
                        if (book.getAvailableCopies() <= 0) {
                                throw new IllegalStateException("No copies of this book are currently available");
                        }

                        book.setAvailableCopies(book.getAvailableCopies() - 1);
                        bookRepository.save(book);
                }

                record.setBorrowDate(LocalDate.now());
                record.setDueDate(LocalDate.now().plusDays(BORROW_DAYS));
                record.setStatus(BorrowStatus.BORROWED);

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

                if (record.getStatus() != BorrowStatus.BORROWED) {
                        throw new IllegalStateException("This book is already returned or a return request is pending");
                }

                // Wait for Librarian approval
                record.setStatus(BorrowStatus.RETURN_PENDING);

                BorrowRecord savedRecord = borrowRecordRepository.save(record);

                return mapToResponse(savedRecord);
        }

        @Transactional
        public BorrowRecordResponseDTO returnBookForLibrarian(Long borrowId) {

                BorrowRecord record = borrowRecordRepository.findById(borrowId)
                                .orElseThrow(() -> new ResourceNotFoundException("Borrowing record not found"));

                if (record.getStatus() != BorrowStatus.RETURN_PENDING) {
                        throw new IllegalStateException("There is no pending return request for this book");
                }

                record.setReturnDate(LocalDate.now());
                record.setStatus(BorrowStatus.RETURNED);

                Book book = bookRepository.findByIdForUpdate(record.getBook().getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

                // Assign the returned copy to the next waiting member
                Optional<ReservationResponseDTO> assignedReservation = reservationService
                                .assignNextReservation(book.getId());

                if (assignedReservation.isEmpty()) {
                        // Nobody is waiting, so make the copy available
                        book.setAvailableCopies(book.getAvailableCopies() + 1);
                        bookRepository.save(book);
                }

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

        @Transactional(readOnly = true)
        public List<BorrowRecordResponseDTO> getAllBorrowings() {

                return borrowRecordRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<BorrowRecordResponseDTO> getPendingBorrowRequests() {

                return borrowRecordRepository.findByStatus(BorrowStatus.BORROW_PENDING)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<BorrowRecordResponseDTO> getPendingReturnRequests() {

                return borrowRecordRepository.findByStatus(BorrowStatus.RETURN_PENDING)
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
}