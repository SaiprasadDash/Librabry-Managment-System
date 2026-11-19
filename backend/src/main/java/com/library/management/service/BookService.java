package com.library.management.service;

import com.library.management.dto.AuthorResponseDTO;
import com.library.management.dto.BookPatchDTO;
import com.library.management.dto.BookRequestDTO;
import com.library.management.dto.BookResponseDTO;
import com.library.management.dto.CategoryResponseDTO;
import com.library.management.entity.Book;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.CategoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

import com.library.management.entity.Author;
import com.library.management.entity.Category;
import java.util.Set;
import java.util.HashSet;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    public BookService(
            BookRepository bookRepository,
            AuthorRepository authorRepository,
            CategoryRepository categoryRepository) {

        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
    }

    // Add a new book
    @Transactional
    public BookResponseDTO addBook(BookRequestDTO request) {

        if (bookRepository.existsByIsbn(request.isbn())) {
            throw new DuplicateResourceException(
                    "Book already exists with ISBN: " + request.isbn());
        }

        Book book = new Book();

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setDescription(request.description());
        book.setPublisher(request.publisher());
        book.setPublishedYear(request.publishedYear());
        book.setTotalCopies(request.totalCopies());
        book.setAvailableCopies(request.totalCopies());

        // Assign Authors
        if (request.authorIds() != null && !request.authorIds().isEmpty()) {

            Set<Author> authors = new HashSet<>(
                    authorRepository.findAllById(request.authorIds()));

            if (authors.size() != request.authorIds().size()) {
                throw new ResourceNotFoundException(
                        "One or more authors were not found");
            }

            book.setAuthors(authors);
        }

        // Assign Categories
        if (request.categoryIds() != null && !request.categoryIds().isEmpty()) {

            Set<Category> categories = new HashSet<>(
                    categoryRepository.findAllById(request.categoryIds()));

            if (categories.size() != request.categoryIds().size()) {
                throw new ResourceNotFoundException(
                        "One or more categories were not found");
            }

            book.setCategories(categories);
        }

        Book savedBook = bookRepository.save(book);

        return mapToResponse(savedBook);
    }

    @Transactional
    public BookResponseDTO updateBook(Long id, BookRequestDTO request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with ID: " + id));

        if (!book.getIsbn().equals(request.isbn())
                && bookRepository.existsByIsbn(request.isbn())) {

            throw new DuplicateResourceException(
                    "A book with this ISBN already exists");
        }

        // Calculate borrowed copies BEFORE updating total copies
        int borrowedCopies = book.getTotalCopies()
                - book.getAvailableCopies();

        if (request.totalCopies() < borrowedCopies) {
            throw new IllegalArgumentException(
                    "Total copies cannot be less than borrowed copies");
        }

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setDescription(request.description());
        book.setPublisher(request.publisher());
        book.setPublishedYear(request.publishedYear());
        book.setTotalCopies(request.totalCopies());

        book.setAvailableCopies(
                request.totalCopies() - borrowedCopies);

        return mapToResponse(bookRepository.save(book));
    }

    @Transactional
    public BookResponseDTO patchBook(Long id, BookPatchDTO request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with ID: " + id));

        // Update title only if provided
        if (request.title() != null) {
            book.setTitle(request.title());
        }

        // Update ISBN only if provided
        if (request.isbn() != null) {

            if (!book.getIsbn().equals(request.isbn())
                    && bookRepository.existsByIsbn(request.isbn())) {

                throw new DuplicateResourceException(
                        "A book with this ISBN already exists");
            }

            book.setIsbn(request.isbn());
        }

        if (request.description() != null) {
            book.setDescription(request.description());
        }

        if (request.publisher() != null) {
            book.setPublisher(request.publisher());
        }

        if (request.publishedYear() != null) {
            book.setPublishedYear(request.publishedYear());
        }

        if (request.totalCopies() != null) {

            int borrowedCopies = book.getTotalCopies()
                    - book.getAvailableCopies();

            if (request.totalCopies() < borrowedCopies) {
                throw new IllegalArgumentException(
                        "Total copies cannot be less than borrowed copies");
            }

            book.setTotalCopies(request.totalCopies());
            book.setAvailableCopies(
                    request.totalCopies() - borrowedCopies);
        }

        Book updatedBook = bookRepository.save(book);

        return mapToResponse(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with ID: " + id));

        bookRepository.delete(book);
    }

    // Get all books
    @Transactional(readOnly = true)
    public List<BookResponseDTO> getAllBooks() {

        return bookRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get book by ID
    @Transactional(readOnly = true)
    public BookResponseDTO getBookById(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with ID: " + id));

        return mapToResponse(book);
    }

    @Transactional(readOnly = true)
    public Page<BookResponseDTO> getAllBooks(Pageable pageable) {

        return bookRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookResponseDTO> searchBooks(
            String keyword,
            Pageable pageable) {

        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException(
                    "Search keyword cannot be empty");
        }

        String searchTerm = keyword.trim();

        return bookRepository
                .findByTitleContainingIgnoreCaseOrIsbnContainingIgnoreCaseOrPublisherContainingIgnoreCase(
                        searchTerm,
                        searchTerm,
                        searchTerm,
                        pageable)
                .map(this::mapToResponse);
    }

    // Convert Entity into Response DTO
    private BookResponseDTO mapToResponse(Book book) {

        return new BookResponseDTO(
                book.getId(),
                book.getTitle(),
                book.getIsbn(),
                book.getDescription(),
                book.getPublisher(),
                book.getPublishedYear(),
                book.getTotalCopies(),
                book.getAvailableCopies(),

                book.getAuthors()
                        .stream()
                        .map(author -> new AuthorResponseDTO(
                                author.getId(),
                                author.getName(),
                                author.getBiography()))
                        .collect(Collectors.toSet()),

                book.getCategories()
                        .stream()
                        .map(category -> new CategoryResponseDTO(
                                category.getId(),
                                category.getName(),
                                category.getDescription()))
                        .collect(Collectors.toSet()),

                book.getCreatedAt(),
                book.getUpdatedAt());
    }
}
