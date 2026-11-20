
package com.library.management.service;

import com.library.management.dto.BookRequestDTO;
import com.library.management.dto.BookPatchDTO;
import com.library.management.dto.BookResponseDTO;
import com.library.management.entity.Book;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.CategoryRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

        @Mock
        private BookRepository bookRepository;

        @Mock
        private AuthorRepository authorRepository;

        @Mock
        private CategoryRepository categoryRepository;

        @InjectMocks
        private BookService bookService;

        // Helper method: Creates a sample book request
        private BookRequestDTO validBookRequest() {
                return new BookRequestDTO(
                                "Clean Code",
                                "9780132350884",
                                "A book about clean coding practices",
                                "Prentice Hall",
                                2008,
                                5,
                                Set.of(),
                                Set.of());
        }

        // Helper method: Creates a sample existing book
        private Book sampleBook() {
                Book book = new Book();

                book.setId(1L);
                book.setTitle("Clean Code");
                book.setIsbn("9780132350884");
                book.setDescription("A book about clean coding practices");
                book.setPublisher("Prentice Hall");
                book.setPublishedYear(2008);
                book.setTotalCopies(5);
                book.setAvailableCopies(5);

                return book;
        }

        // ==========================================
        // 1. ADD BOOK TESTS
        // ==========================================

        @Test
        void addBook_ShouldCreateBookSuccessfully() {

                BookRequestDTO request = validBookRequest();

                when(bookRepository.existsByIsbn(request.isbn()))
                                .thenReturn(false);

                when(bookRepository.save(any(Book.class)))
                                .thenAnswer(invocation -> {
                                        Book book = invocation.getArgument(0);
                                        book.setId(1L);
                                        return book;
                                });

                BookResponseDTO response = bookService.addBook(request);

                assertNotNull(response);
                assertEquals(1L, response.id());
                assertEquals("Clean Code", response.title());
                assertEquals("9780132350884", response.isbn());
                assertEquals(5, response.totalCopies());
                assertEquals(5, response.availableCopies());

                verify(bookRepository).existsByIsbn(request.isbn());
                verify(bookRepository).save(any(Book.class));
        }

        @Test
        void addBook_ShouldThrowException_WhenIsbnAlreadyExists() {

                BookRequestDTO request = validBookRequest();

                when(bookRepository.existsByIsbn(request.isbn()))
                                .thenReturn(true);

                assertThrows(
                                DuplicateResourceException.class,
                                () -> bookService.addBook(request));

                verify(bookRepository, never()).save(any(Book.class));
        }

        @Test
        void addBook_ShouldThrowException_WhenAuthorDoesNotExist() {

                BookRequestDTO request = new BookRequestDTO(
                                "Clean Code",
                                "9780132350884",
                                "Description",
                                "Prentice Hall",
                                2008,
                                5,
                                Set.of(99L),
                                Set.of());

                when(bookRepository.existsByIsbn(request.isbn()))
                                .thenReturn(false);

                when(authorRepository.findAllById(request.authorIds()))
                                .thenReturn(List.of());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.addBook(request));

                verify(bookRepository, never()).save(any(Book.class));
        }

        @Test
        void addBook_ShouldThrowException_WhenCategoryDoesNotExist() {

                BookRequestDTO request = new BookRequestDTO(
                                "Clean Code",
                                "9780132350884",
                                "Description",
                                "Prentice Hall",
                                2008,
                                5,
                                Set.of(),
                                Set.of(99L));

                when(bookRepository.existsByIsbn(request.isbn()))
                                .thenReturn(false);

                // when(authorRepository.findAllById(Set.of()))
                // .thenReturn(List.of());

                when(categoryRepository.findAllById(request.categoryIds()))
                                .thenReturn(List.of());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.addBook(request));

                verify(bookRepository, never()).save(any(Book.class));
        }

        // ==========================================
        // 2. UPDATE BOOK TESTS
        // ==========================================

        @Test
        void updateBook_ShouldUpdateBookSuccessfully() {

                Book book = sampleBook();
                BookRequestDTO request = validBookRequest();

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(authorRepository.findAllById(Set.of()))
                                .thenReturn(List.of());

                when(categoryRepository.findAllById(Set.of()))
                                .thenReturn(List.of());

                when(bookRepository.save(any(Book.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                BookResponseDTO response = bookService.updateBook(1L, request);

                assertNotNull(response);
                assertEquals("Clean Code", response.title());
                assertEquals(5, response.totalCopies());

                verify(bookRepository).save(book);
        }

        @Test
        void updateBook_ShouldThrowException_WhenBookDoesNotExist() {

                BookRequestDTO request = validBookRequest();

                when(bookRepository.findById(99L))
                                .thenReturn(Optional.empty());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.updateBook(99L, request));

                verify(bookRepository, never()).save(any(Book.class));
        }

        @Test
        void updateBook_ShouldThrowException_WhenIsbnAlreadyExists() {

                Book book = sampleBook();

                BookRequestDTO request = new BookRequestDTO(
                                "Clean Code",
                                "NEW-ISBN",
                                "Description",
                                "Publisher",
                                2008,
                                5,
                                Set.of(),
                                Set.of());

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(bookRepository.existsByIsbn("NEW-ISBN"))
                                .thenReturn(true);

                assertThrows(
                                DuplicateResourceException.class,
                                () -> bookService.updateBook(1L, request));

                verify(bookRepository, never()).save(any(Book.class));
        }

        @Test
        void updateBook_ShouldThrowException_WhenTotalCopiesLessThanBorrowedCopies() {

                Book book = sampleBook();

                // 5 total copies, 2 available means 3 borrowed
                book.setAvailableCopies(2);

                BookRequestDTO request = new BookRequestDTO(
                                "Clean Code",
                                "9780132350884",
                                "Description",
                                "Publisher",
                                2008,
                                2,
                                Set.of(),
                                Set.of());

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                assertThrows(
                                IllegalArgumentException.class,
                                () -> bookService.updateBook(1L, request));

                verify(bookRepository, never()).save(any(Book.class));
        }

        @Test
        void updateBook_ShouldThrowException_WhenAuthorDoesNotExist() {

                Book book = sampleBook();

                BookRequestDTO request = new BookRequestDTO(
                                "Clean Code",
                                "9780132350884",
                                "Description",
                                "Publisher",
                                2008,
                                5,
                                Set.of(99L),
                                Set.of());

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(authorRepository.findAllById(request.authorIds()))
                                .thenReturn(List.of());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.updateBook(1L, request));
        }

        @Test
        void updateBook_ShouldThrowException_WhenCategoryDoesNotExist() {

                Book book = sampleBook();

                BookRequestDTO request = new BookRequestDTO(
                                "Clean Code",
                                "9780132350884",
                                "Description",
                                "Publisher",
                                2008,
                                5,
                                Set.of(),
                                Set.of(99L));

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(authorRepository.findAllById(Set.of()))
                                .thenReturn(List.of());

                when(categoryRepository.findAllById(request.categoryIds()))
                                .thenReturn(List.of());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.updateBook(1L, request));
        }

        // ==========================================
        // 3. PATCH BOOK TESTS
        // ==========================================

        @Test
        void patchBook_ShouldUpdateOnlyProvidedFields() {

                Book book = sampleBook();

                BookPatchDTO request = new BookPatchDTO(
                                "Updated Clean Code",
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null);

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(bookRepository.save(any(Book.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                BookResponseDTO response = bookService.patchBook(1L, request);

                assertEquals("Updated Clean Code", response.title());

                // Other fields should remain unchanged
                assertEquals("9780132350884", response.isbn());
                assertEquals("Prentice Hall", response.publisher());
                assertEquals(5, response.totalCopies());
        }

        @Test
        void patchBook_ShouldThrowException_WhenBookDoesNotExist() {

                BookPatchDTO request = new BookPatchDTO(
                                "Updated Title",
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null);

                when(bookRepository.findById(99L))
                                .thenReturn(Optional.empty());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.patchBook(99L, request));
        }

        @Test
        void patchBook_ShouldThrowException_WhenIsbnAlreadyExists() {

                Book book = sampleBook();

                BookPatchDTO request = new BookPatchDTO(
                                null,
                                "NEW-ISBN",
                                null,
                                null,
                                null,
                                null,
                                null,
                                null);

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(bookRepository.existsByIsbn("NEW-ISBN"))
                                .thenReturn(true);

                assertThrows(
                                DuplicateResourceException.class,
                                () -> bookService.patchBook(1L, request));
        }

        @Test
        void patchBook_ShouldThrowException_WhenTotalCopiesLessThanBorrowedCopies() {

                Book book = sampleBook();
                book.setAvailableCopies(2);

                BookPatchDTO request = new BookPatchDTO(
                                null,
                                null,
                                null,
                                null,
                                null,
                                2,
                                null,
                                null);

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                assertThrows(
                                IllegalArgumentException.class,
                                () -> bookService.patchBook(1L, request));
        }

        @Test
        void patchBook_ShouldThrowException_WhenAuthorDoesNotExist() {

                Book book = sampleBook();

                BookPatchDTO request = new BookPatchDTO(
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                Set.of(99L),
                                null);

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(authorRepository.findAllById(request.authorIds()))
                                .thenReturn(List.of());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.patchBook(1L, request));
        }

        @Test
        void patchBook_ShouldThrowException_WhenCategoryDoesNotExist() {

                Book book = sampleBook();

                BookPatchDTO request = new BookPatchDTO(
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                Set.of(99L));

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                when(categoryRepository.findAllById(request.categoryIds()))
                                .thenReturn(List.of());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.patchBook(1L, request));
        }

        // ==========================================
        // 4. DELETE BOOK TESTS
        // ==========================================

        @Test
        void deleteBook_ShouldDeleteBookSuccessfully() {

                Book book = sampleBook();

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                bookService.deleteBook(1L);

                verify(bookRepository).delete(book);
        }

        @Test
        void deleteBook_ShouldThrowException_WhenBookDoesNotExist() {

                when(bookRepository.findById(99L))
                                .thenReturn(Optional.empty());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.deleteBook(99L));

                verify(bookRepository, never()).delete(any(Book.class));
        }

        // ==========================================
        // 5. GET BOOK TESTS
        // ==========================================

        @Test
        void getBookById_ShouldReturnBookSuccessfully() {

                Book book = sampleBook();

                when(bookRepository.findById(1L))
                                .thenReturn(Optional.of(book));

                BookResponseDTO response = bookService.getBookById(1L);

                assertNotNull(response);
                assertEquals(1L, response.id());
                assertEquals("Clean Code", response.title());
        }

        @Test
        void getBookById_ShouldThrowException_WhenBookDoesNotExist() {

                when(bookRepository.findById(99L))
                                .thenReturn(Optional.empty());

                assertThrows(
                                ResourceNotFoundException.class,
                                () -> bookService.getBookById(99L));
        }

        @Test
        void getAllBooks_ShouldReturnAllBooks() {

                Book book = sampleBook();

                when(bookRepository.findAll())
                                .thenReturn(List.of(book));

                List<BookResponseDTO> response = bookService.getAllBooks();

                assertEquals(1, response.size());
                assertEquals("Clean Code", response.get(0).title());
        }

        @Test
        void getAllBooks_ShouldReturnPaginatedBooks() {

                Pageable pageable = PageRequest.of(0, 10);
                Book book = sampleBook();

                Page<Book> bookPage = new PageImpl<>(
                                List.of(book),
                                pageable,
                                1);

                when(bookRepository.findAll(pageable))
                                .thenReturn(bookPage);

                Page<BookResponseDTO> response = bookService.getAllBooks(pageable);

                assertEquals(1, response.getTotalElements());
                assertEquals("Clean Code", response.getContent().get(0).title());
        }

        // ==========================================
        // 6. SEARCH BOOK TESTS
        // ==========================================

        @Test
        void searchBooks_ShouldReturnMatchingBooks() {

                Pageable pageable = PageRequest.of(0, 10);
                Book book = sampleBook();

                Page<Book> bookPage = new PageImpl<>(
                                List.of(book),
                                pageable,
                                1);

                when(bookRepository
                                .findByTitleContainingIgnoreCaseOrIsbnContainingIgnoreCaseOrPublisherContainingIgnoreCase(
                                                "Clean",
                                                "Clean",
                                                "Clean",
                                                pageable))
                                .thenReturn(bookPage);

                Page<BookResponseDTO> response = bookService.searchBooks("Clean", pageable);

                assertEquals(1, response.getTotalElements());
                assertEquals("Clean Code", response.getContent().get(0).title());
        }

        @Test
        void searchBooks_ShouldThrowException_WhenKeywordIsEmpty() {

                Pageable pageable = PageRequest.of(0, 10);

                assertThrows(
                                IllegalArgumentException.class,
                                () -> bookService.searchBooks("  ", pageable));

                verify(bookRepository, never())
                                .findByTitleContainingIgnoreCaseOrIsbnContainingIgnoreCaseOrPublisherContainingIgnoreCase(
                                                any(String.class),
                                                any(String.class),
                                                any(String.class),
                                                any(Pageable.class));
        }
}
