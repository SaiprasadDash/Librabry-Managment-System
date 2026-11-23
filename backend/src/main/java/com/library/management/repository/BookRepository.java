
package com.library.management.repository;

import com.library.management.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByIsbn(String isbn);

    long countByCreatedAtGreaterThanEqual(LocalDateTime date);

    Page<Book> findByTitleContainingIgnoreCaseOrIsbnContainingIgnoreCaseOrPublisherContainingIgnoreCase(
            String title,
            String isbn,
            String publisher,
            Pageable pageable);
}