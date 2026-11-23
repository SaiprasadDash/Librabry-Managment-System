package com.library.management.dto;

import com.library.management.entity.Role;
import java.time.LocalDateTime;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        Role role,
        boolean enabled,
        LocalDateTime createdAt) {
}