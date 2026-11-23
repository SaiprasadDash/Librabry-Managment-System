
package com.library.management.repository;

import com.library.management.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByIsbn(String isbn);

    long countByCreatedAtGreaterThanEqual(LocalDateTime date);

    Page<Book> findByTitleContainingIgnoreCaseOrIsbnContainingIgnoreCaseOrPublisherContainingIgnoreCase(
            String title,
            String isbn,
            String publisher,
            Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Book b WHERE b.id = :bookId")
    Optional<Book> findByIdForUpdate(@Param("bookId") Long bookId);
}