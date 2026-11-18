
package com.library.management.controller;

import com.library.management.dto.CategoryRequestDTO;
import com.library.management.dto.CategoryResponseDTO;
import com.library.management.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Create Category
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(
            @Valid @RequestBody CategoryRequestDTO request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    // Get All Categories
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {

        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // Get Category By ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // Update Category
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO request) {

        return ResponseEntity.ok(
                categoryService.updateCategory(id, request));
    }

    // Delete Category
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Map<String, String>> deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Category deleted successfully");
        response.put("categoryId", id.toString());

        return ResponseEntity.ok(response);
    }
}
