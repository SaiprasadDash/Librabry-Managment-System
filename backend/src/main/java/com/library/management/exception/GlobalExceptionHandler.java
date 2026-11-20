
package com.library.management.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.security.core.AuthenticationException;
import java.util.HashMap;

import java.time.LocalDateTime;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(DuplicateResourceException.class)
        public ResponseEntity<Map<String, Object>> handleDuplicateResource(
                        DuplicateResourceException ex) {

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", HttpStatus.CONFLICT.value(),
                                "error", "Conflict",
                                "message", ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(response);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleNotFound(
                        ResourceNotFoundException ex) {

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", 404,
                                "error", "Not Found",
                                "message", ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> handleValidationErrors(
                        MethodArgumentNotValidException ex) {

                Map<String, String> fieldErrors = new HashMap<>();

                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", HttpStatus.BAD_REQUEST.value(),
                                "error", "Validation Failed",
                                "message", "Please correct the invalid fields",
                                "fieldErrors", fieldErrors);

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(response);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<Map<String, Object>> handleIllegalArgument(
                        IllegalArgumentException ex) {

                Map<String, Object> body = new HashMap<>();
                body.put("timestamp", LocalDateTime.now());
                body.put("status", 400);
                body.put("error", "Bad Request");
                body.put("message", ex.getMessage());

                return ResponseEntity.badRequest().body(body);
        }

        @ExceptionHandler(IllegalStateException.class)
        public ResponseEntity<Map<String, Object>> handleIllegalState(
                        IllegalStateException ex) {

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", HttpStatus.CONFLICT.value(),
                                "error", "Conflict",
                                "message", ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(response);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<Map<String, Object>> handleGeneralException(
                        Exception ex) {

                logger.error("Unexpected error occurred", ex);

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "error", "Internal Server Error",
                                "message", "Something went wrong. Please try again later.");

                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(response);
        }

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<Map<String, Object>> handleAuthenticationException(
                        AuthenticationException ex) {

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", HttpStatus.UNAUTHORIZED.value(),
                                "error", "Unauthorized",
                                "message", "Invalid email or password");

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
}
