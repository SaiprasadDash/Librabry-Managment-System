package com.library.management.repository;

import com.library.management.entity.Reservation;
import com.library.management.entity.ReservationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;
import java.util.List;

public interface ReservationRepository
                extends JpaRepository<Reservation, Long> {

        List<Reservation> findByBookIdAndStatusOrderByReservationDateAsc(
                        Long bookId,
                        ReservationStatus status);

        List<Reservation> findByUserId(Long userId);

        boolean existsByUserIdAndBookIdAndStatus(
                        Long userId,
                        Long bookId,
                        ReservationStatus status);

        Optional<Reservation> findByIdAndUserId(Long id, Long userId);

        List<Reservation> findByBookIdAndStatusOrderByReservationDateAsc(
                        Long bookId,
                        ReservationStatus status,
                        Pageable pageable);

        Optional<Reservation> findByBookIdAndUserIdAndStatus(
                        Long bookId,
                        Long userId,
                        ReservationStatus status);

        long countByBookIdAndStatus(Long bookId, ReservationStatus status);
}