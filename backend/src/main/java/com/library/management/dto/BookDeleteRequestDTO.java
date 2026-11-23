package com.library.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookDeleteRequestDTO(

        @NotBlank(message = "Deletion reason is required") @Size(max = 500, message = "Reason cannot exceed 500 characters") String reason

) {
}