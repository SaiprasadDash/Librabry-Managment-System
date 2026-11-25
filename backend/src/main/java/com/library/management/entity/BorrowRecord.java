package com.library.management.entity;

import com.library.management.entity.User;
import com.library.management.entity.Book;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "borrow_records")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private LocalDate borrowDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private BorrowStatus status;

    public static void main(String[] args) {
        BorrowRecord record = new BorrowRecord(1L, new User(), new Book(), LocalDate.now(),
                LocalDate.now().plusDays(14), null, BorrowStatus.BORROWED);
        BorrowRecord record2 = new BorrowRecord();
    }
}
