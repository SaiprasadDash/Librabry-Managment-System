package com.library.management.service;

import com.library.management.dto.ReservationResponseDTO;
import com.library.management.entity.Book;
import com.library.management.entity.Reservation;
import com.library.management.entity.ReservationStatus;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.ReservationRepository;
import com.library.management.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReservationResponseDTO reserveBook(Long bookId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (book.getAvailableCopies() > 0) {
            throw new IllegalStateException(
                    "This book is currently available. You can borrow it directly.");
        }

        boolean alreadyReserved = reservationRepository
                .existsByUserIdAndBookIdAndStatus(
                        user.getId(), bookId, ReservationStatus.WAITING);

        if (alreadyReserved) {
            throw new IllegalStateException(
                    "You have already reserved this book.");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setStatus(ReservationStatus.WAITING);

        Reservation savedReservation = reservationRepository.save(reservation);

        return mapToResponse(savedReservation);
    }

    private ReservationResponseDTO mapToResponse(Reservation reservation) {

        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getBook().getId(),
                reservation.getBook().getTitle(),
                reservation.getUser().getId(),
                reservation.getUser().getName(),
                reservation.getUser().getEmail(),
                reservation.getStatus(),
                reservation.getReservationDate());
    }
}