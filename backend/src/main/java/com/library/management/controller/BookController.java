
package com.library.management.controller;

import com.library.management.dto.BookPatchDTO;
import com.library.management.dto.BookRequestDTO;
import com.library.management.dto.BookResponseDTO;
import com.library.management.service.BookService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponseDTO addBook(
            @Valid @RequestBody BookRequestDTO request) {

        return bookService.addBook(request);
    }

    @GetMapping
    public List<BookResponseDTO> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public BookResponseDTO getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public BookResponseDTO updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequestDTO request) {

        return bookService.updateBook(id, request);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public BookResponseDTO patchBook(
            @PathVariable Long id,
            @Valid @RequestBody BookPatchDTO request) {

        return bookService.patchBook(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteBook(
            @PathVariable Long id) {

        bookService.deleteBook(id);

        Map<String, String> response = Map.of(
                "message", "Book deleted successfully",
                "bookId", id.toString());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/page")
    public Page<BookResponseDTO> getBooksWithPagination(
            Pageable pageable) {

        return bookService.getAllBooks(pageable);
    }

    @GetMapping("/search")
    public Page<BookResponseDTO> searchBooks(
            @RequestParam String keyword,
            @PageableDefault(size = 5, sort = "title", direction = Sort.Direction.ASC) Pageable pageable) {

        return bookService.searchBooks(keyword, pageable);
    }

}
