
package com.library.management.service;

import com.library.management.entity.BorrowRecord;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

@Service
public class FineCalculationService {

    private static final double FINE_PER_DAY = 5.0;

    public double calculateFine(BorrowRecord record) {

        // Pending borrowing requests have no due date
        if (record.getDueDate() == null) {
            return 0.0;
        }

        LocalDate endDate = record.getReturnDate() != null
                ? record.getReturnDate()
                : LocalDate.now();

        if (!endDate.isAfter(record.getDueDate())) {
            return 0.0;
        }

        long overdueDays = ChronoUnit.DAYS.between(
                record.getDueDate(), endDate);

        return overdueDays * FINE_PER_DAY;
    }
}
