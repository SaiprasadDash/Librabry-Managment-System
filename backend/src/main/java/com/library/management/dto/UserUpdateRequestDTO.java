package com.library.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateRequestDTO(

        @NotBlank(message = "Name is required") @Size(max = 100, message = "Name cannot exceed 100 characters") String name,

        @NotBlank(message = "Email is required") @Email(message = "Please provide a valid email") String email,

        @NotNull(message = "Account status is required") Boolean enabled) {
}