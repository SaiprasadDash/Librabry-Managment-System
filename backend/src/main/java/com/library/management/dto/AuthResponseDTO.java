
package com.library.management.dto;

public class AuthResponseDTO {

    private String message;
    private String token;
    private String tokenType;
    private String email;
    private String role;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(
            String message,
            String token,
            String email,
            String role) {
        this.message = message;
        this.token = token;
        this.tokenType = "Bearer";
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
