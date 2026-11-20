package com.library.management.repository;

import com.library.management.entity.Reservation;
import com.library.management.entity.ReservationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

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
}