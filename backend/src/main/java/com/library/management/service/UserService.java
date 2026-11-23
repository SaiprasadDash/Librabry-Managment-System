
package com.library.management.service;

import com.library.management.dto.LibrarianRequestDTO;
import com.library.management.dto.UserResponseDTO;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.library.management.dto.UserUpdateRequestDTO;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String createLibrarian(LibrarianRequestDTO request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email is already registered");
        }

        User librarian = new User();

        librarian.setName(request.name());
        librarian.setEmail(request.email());

        librarian.setPassword(
                passwordEncoder.encode(request.password()));

        librarian.setRole(Role.LIBRARIAN);
        librarian.setEnabled(true);

        userRepository.save(librarian);

        return "Librarian account created successfully";
    }

    // Get all members and librarians
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAllMembersAndLibrarians();
    }

    public UserResponseDTO updateUser(Long id, UserUpdateRequestDTO request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin account cannot be updated through this API");
        }

        userRepository.findByEmail(request.email())
                .filter(existingUser -> !existingUser.getId().equals(id))
                .ifPresent(existingUser -> {
                    throw new IllegalArgumentException("Email is already registered");
                });

        user.setName(request.name());
        user.setEmail(request.email());
        user.setEnabled(request.enabled());

        User updatedUser = userRepository.save(user);

        return new UserResponseDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole(),
                updatedUser.isEnabled(),
                updatedUser.getCreatedAt());
    }

    public String disableUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException(
                    "Admin account cannot be disabled through this API");
        }

        user.setEnabled(false);
        userRepository.save(user);

        return "User disabled successfully";
    }

    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin user not found");
        }

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt());
    }
}
