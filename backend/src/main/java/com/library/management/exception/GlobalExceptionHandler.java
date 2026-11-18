
package com.library.management.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.HashMap;

import java.time.LocalDateTime;
import java.util.Map;

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

}
