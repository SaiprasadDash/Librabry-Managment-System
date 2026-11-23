
package com.library.management.repository;

import com.library.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.library.management.entity.Role;
import java.time.LocalDateTime;
import com.library.management.dto.UserResponseDTO;

import java.util.List;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    long countByRoleAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(
            Role role,
            LocalDateTime start,
            LocalDateTime end);

    List<User> findByRoleIn(List<Role> roles);

    @Query("""
                SELECT new com.library.management.dto.UserResponseDTO(
                    u.id,
                    u.name,
                    u.email,
                    u.role,
                    u.enabled,
                    u.createdAt
                )
                FROM User u
                WHERE u.role IN (
                    com.library.management.entity.Role.MEMBER,
                    com.library.management.entity.Role.LIBRARIAN
                )
                ORDER BY u.createdAt DESC
            """)
    List<UserResponseDTO> findAllMembersAndLibrarians();
}
