
package com.library.management.service;

import com.library.management.dto.LibrarianRequestDTO;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
}
