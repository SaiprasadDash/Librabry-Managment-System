package com.library.management.service;

import com.library.management.dto.AuthorRequestDTO;
import com.library.management.dto.AuthorResponseDTO;
import com.library.management.entity.Author;
import com.library.management.repository.AuthorRepository;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

// import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;
    // private final AuthenticationManager authenticationManager;

    // Create Author
    public AuthorResponseDTO createAuthor(AuthorRequestDTO request) {

        if (authorRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException(
                    "Author already exists: " + request.name());
        }

        Author author = new Author();
        author.setName(request.name().trim());
        author.setBiography(request.biography());

        Author savedAuthor = authorRepository.save(author);

        return mapToResponse(savedAuthor);
    }

    // Get All Authors
    @Transactional(readOnly = true)
    public List<AuthorResponseDTO> getAllAuthors() {

        return authorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Author By ID
    @Transactional(readOnly = true)
    public AuthorResponseDTO getAuthorById(Long id) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Author not found with ID: " + id));

        return mapToResponse(author);
    }

    // Update Author
    public AuthorResponseDTO updateAuthor(
            Long id,
            AuthorRequestDTO request) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Author not found with ID: " + id));

        boolean duplicateName = authorRepository
                .existsByNameIgnoreCase(request.name());

        if (duplicateName && !author.getName().equalsIgnoreCase(request.name())) {
            throw new DuplicateResourceException(
                    "Author already exists: " + request.name());
        }

        author.setName(request.name().trim());
        author.setBiography(request.biography());

        return mapToResponse(authorRepository.save(author));
    }

    // Delete Author
    public void deleteAuthor(Long id) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Author not found with ID: " + id));

        authorRepository.delete(author);
    }

    // Entity to DTO Mapping
    private AuthorResponseDTO mapToResponse(Author author) {

        return new AuthorResponseDTO(
                author.getId(),
                author.getName(),
                author.getBiography());
    }
}