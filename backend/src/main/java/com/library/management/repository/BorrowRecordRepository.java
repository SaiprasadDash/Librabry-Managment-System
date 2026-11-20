package com.library.management.repository;

import com.library.management.entity.BorrowRecord;
import com.library.management.entity.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BorrowRecordRepository
                extends JpaRepository<BorrowRecord, Long> {

        List<BorrowRecord> findByUserId(Long userId);

        List<BorrowRecord> findByUserIdAndStatus(
                        Long userId,
                        BorrowStatus status);

        List<BorrowRecord> findByStatus(BorrowStatus status);

        boolean existsByUserIdAndBookIdAndStatus(
                        Long userId,
                        Long bookId,
                        BorrowStatus status);

        List<BorrowRecord> findByStatusAndDueDateBefore(
                        BorrowStatus status,
                        LocalDate date);

        List<BorrowRecord> findByUserIdAndStatusAndDueDateBefore(
                        Long userId,
                        BorrowStatus status,
                        LocalDate date);

        boolean existsByBookId(Long bookId);
}