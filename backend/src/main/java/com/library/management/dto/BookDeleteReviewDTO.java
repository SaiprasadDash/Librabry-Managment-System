package com.library.management.dto;

import com.library.management.entity.DeleteRequestStatus;
import jakarta.validation.constraints.NotNull;

public record BookDeleteReviewDTO(

        @NotNull(message = "Review status is required") DeleteRequestStatus status

) {
}