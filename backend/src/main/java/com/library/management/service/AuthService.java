
package com.library.management.service;

import com.library.management.dto.AuthResponseDTO;
import com.library.management.dto.LoginRequestDTO;
import com.library.management.dto.RegisterRequestDTO;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.repository.UserRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthService(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.authenticationManager = authenticationManager;
        }

        public AuthResponseDTO register(RegisterRequestDTO request) {

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException(
                                        "Email is already registered");
                }

                User user = new User();
                user.setName(request.getName());
                user.setEmail(request.getEmail());
                user.setPassword(
                                passwordEncoder.encode(request.getPassword()));

                // Public registration always creates MEMBER accounts.
                user.setRole(Role.MEMBER);
                user.setEnabled(true);

                userRepository.save(user);

                String token = jwtService.generateToken(user.getEmail());

                return new AuthResponseDTO(
                                "Registration successful",
                                token,
                                user.getEmail(),
                                user.getRole().name());
        }

        public AuthResponseDTO login(LoginRequestDTO request) {

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                String token = jwtService.generateToken(user.getEmail());

                return new AuthResponseDTO(
                                "Login successful",
                                token,
                                user.getEmail(),
                                user.getRole().name());
        }
}
