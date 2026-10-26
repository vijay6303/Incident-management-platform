package com.vijay.incident.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn
) {
}