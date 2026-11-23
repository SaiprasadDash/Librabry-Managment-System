package com.library.management.repository;

import com.library.management.entity.BookDeleteRequest;
import com.library.management.entity.DeleteRequestStatus;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookDeleteRequestRepository
        extends JpaRepository<BookDeleteRequest, Long> {

    List<BookDeleteRequest> findByStatusOrderByRequestedAtDesc(
            DeleteRequestStatus status);

    @Modifying
    @Query("UPDATE BookDeleteRequest r SET r.book = null WHERE r.book.id = :bookId")
    void detachBookReferences(@Param("bookId") Long bookId);

    boolean existsByBookIdAndStatus(
            Long bookId,
            DeleteRequestStatus status);
}