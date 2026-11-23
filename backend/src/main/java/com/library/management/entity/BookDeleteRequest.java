
package com.library.management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "book_delete_requests")
@Getter
@Setter
public class BookDeleteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @Column(nullable = false, length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeleteRequestStatus status = DeleteRequestStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private LocalDateTime requestedAt;

    private LocalDateTime reviewedAt;

    @Column(nullable = false)
    private Long requestedBookId;

    @Column(nullable = false)
    private String bookTitle;

    @Column(nullable = false)
    private String isbn;

    @PrePersist
    protected void onCreate() {
        requestedAt = LocalDateTime.now();
    }
}
