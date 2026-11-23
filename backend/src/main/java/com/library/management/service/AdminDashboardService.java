
package com.library.management.service;

import com.library.management.dto.AdminDashboardResponseDTO;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.BorrowStatus;
import com.library.management.entity.Role;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final FineCalculationService fineCalculationService;

    public AdminDashboardResponseDTO getDashboard() {

        LocalDate today = LocalDate.now();

        // Books added this month
        LocalDateTime monthStart = today
                .withDayOfMonth(1)
                .atStartOfDay();

        long booksAddedThisMonth = bookRepository.countByCreatedAtGreaterThanEqual(monthStart);

        // Members
        long totalMembers = userRepository.countByRole(Role.MEMBER);

        LocalDateTime weekStart = today
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();

        LocalDateTime nextWeekStart = weekStart.plusWeeks(1);

        long membersJoinedThisWeek = userRepository.countByRoleAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                Role.MEMBER,
                weekStart,
                nextWeekStart);

        // Borrowed books
        long booksBorrowed = borrowRecordRepository.countByStatus(BorrowStatus.BORROWED);

        // Overdue books and pending fines
        List<BorrowRecord> overdueRecords = borrowRecordRepository.findByStatusAndDueDateBefore(
                BorrowStatus.BORROWED,
                today);

        long overdueBooks = overdueRecords.size();

        double pendingFines = overdueRecords.stream()
                .mapToDouble(fineCalculationService::calculateFine)
                .sum();

        // Total book copies
        long totalBooks = bookRepository.findAll().stream()
                .mapToLong(book -> book.getTotalCopies() == null
                        ? 0
                        : book.getTotalCopies())
                .sum();

        // Recent 5 borrowings
        List<AdminDashboardResponseDTO.RecentBorrowing> recentBorrowings = borrowRecordRepository
                .findTop5ByOrderByBorrowDateDesc()
                .stream()
                .map(record -> new AdminDashboardResponseDTO.RecentBorrowing(
                        record.getBook().getTitle(),
                        record.getUser().getName(),
                        record.getBorrowDate(),
                        record.getDueDate(),
                        record.getStatus() == BorrowStatus.BORROWED
                                && record.getDueDate().isBefore(today)
                                        ? "OVERDUE"
                                        : record.getStatus().name()))
                .toList();

        // Overdue books list
        List<AdminDashboardResponseDTO.OverdueBook> overdueBooksList = overdueRecords.stream()
                .map(record -> new AdminDashboardResponseDTO.OverdueBook(
                        record.getBook().getTitle(),
                        record.getUser().getName(),
                        ChronoUnit.DAYS.between(record.getDueDate(), today),
                        fineCalculationService.calculateFine(record)))
                .toList();

        return new AdminDashboardResponseDTO(
                totalBooks,
                booksAddedThisMonth,
                totalMembers,
                membersJoinedThisWeek,
                booksBorrowed,
                overdueBooks,
                pendingFines,
                recentBorrowings,
                overdueBooksList);
    }
}
