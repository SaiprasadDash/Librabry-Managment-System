package com.library.management.controller;

import com.library.management.dto.ReservationResponseDTO;
import com.library.management.service.ReservationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/{bookId}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ReservationResponseDTO> reserveBook(
            @PathVariable Long bookId,
            Authentication authentication) {

        ReservationResponseDTO response = reservationService.reserveBook(
                bookId, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<ReservationResponseDTO>> getMyReservations(
            Authentication authentication) {

        List<ReservationResponseDTO> reservations = reservationService.getMyReservations(authentication.getName());

        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/{reservationId}/cancel")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ReservationResponseDTO> cancelReservation(
            @PathVariable Long reservationId,
            Authentication authentication) {

        ReservationResponseDTO response = reservationService.cancelReservation(
                reservationId, authentication.getName());

        return ResponseEntity.ok(response);
    }
}