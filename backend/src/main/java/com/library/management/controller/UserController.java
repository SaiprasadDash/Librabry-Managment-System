
package com.library.management.controller;

import com.library.management.dto.LibrarianRequestDTO;
import com.library.management.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
