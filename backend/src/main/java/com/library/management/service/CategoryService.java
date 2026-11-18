
package com.library.management.service;

import com.library.management.dto.CategoryRequestDTO;
import com.library.management.dto.CategoryResponseDTO;
import com.library.management.entity.Category;
import com.library.management.repository.CategoryRepository;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Create Category
    public CategoryResponseDTO createCategory(
            CategoryRequestDTO request) {

        String name = request.name().trim();

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException(
                    "Category already exists: " + name);
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(request.description());

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    // Get All Categories
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Category By ID
    @Transactional(readOnly = true)
    public CategoryResponseDTO getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + id));

        return mapToResponse(category);
    }

    // Update Category
    public CategoryResponseDTO updateCategory(
            Long id,
            CategoryRequestDTO request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + id));

        String name = request.name().trim();

        boolean duplicateName = categoryRepository.existsByNameIgnoreCase(name);

        if (duplicateName &&
                !category.getName().equalsIgnoreCase(name)) {

            throw new DuplicateResourceException(
                    "Category already exists: " + name);
        }

        category.setName(name);
        category.setDescription(request.description());

        return mapToResponse(categoryRepository.save(category));
    }

    // Delete Category
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + id));

        categoryRepository.delete(category);
    }

    // Entity to DTO Mapping
    private CategoryResponseDTO mapToResponse(Category category) {

        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getDescription());
    }
}
