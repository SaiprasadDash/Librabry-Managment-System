
package com.library.management.dto;

import java.time.LocalDate;
import java.util.List;

public record AdminDashboardResponseDTO(
                long totalBooks,
                long booksAddedThisMonth,
                long totalMembers,
                long membersJoinedThisWeek,
                long booksBorrowed,
                long overdueBooks,
                double pendingFines,
                List<RecentBorrowing> recentBorrowings,
                List<OverdueBook> overdueBooksList) {

        public record RecentBorrowing(
                        String bookTitle,
                        String memberName,
                        LocalDate borrowedOn,
                        LocalDate dueDate,
                        String status) {
        }

        public record OverdueBook(
                        String bookTitle,
                        String memberName,
                        long overdueDays,
                        double fine) {
        }
}
