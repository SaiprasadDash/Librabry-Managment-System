package com.library.management.controller;

import com.library.management.dto.AuthorRequestDTO;
import com.library.management.dto.AuthorResponseDTO;
import com.library.management.service.AuthorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    // Create Author
    @PostMapping
    public ResponseEntity<AuthorResponseDTO> createAuthor(
            @Valid @RequestBody AuthorRequestDTO request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authorService.createAuthor(request));
    }

    // Get All Authors
    @GetMapping
    public ResponseEntity<List<AuthorResponseDTO>> getAllAuthors() {

        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    // Get Author By ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<AuthorResponseDTO> getAuthorById(
            @PathVariable Long id) {

        return ResponseEntity.ok(authorService.getAuthorById(id));
    }

    // Update Author
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<AuthorResponseDTO> updateAuthor(
            @PathVariable Long id,
            @Valid @RequestBody AuthorRequestDTO request) {

        return ResponseEntity.ok(
                authorService.updateAuthor(id, request));
    }

    // Delete Author
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Map<String, String>> deleteAuthor(
            @PathVariable Long id) {

        authorService.deleteAuthor(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Author deleted successfully");
        response.put("authorId", id.toString());

        return ResponseEntity.ok(response);
    }
}