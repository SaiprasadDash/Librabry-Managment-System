
package com.library.management.controller;

import com.library.management.dto.LibrarianRequestDTO;
import com.library.management.dto.UserResponseDTO;
import com.library.management.dto.UserUpdateRequestDTO;
import com.library.management.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/librarians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> createLibrarian(
            @Valid @RequestBody LibrarianRequestDTO request) {

        String message = userService.createLibrarian(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", message));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequestDTO request) {

        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> disableUser(
            @PathVariable Long id) {

        String message = userService.disableUser(id);

        return ResponseEntity.ok(Map.of("message", message));
    }
}
