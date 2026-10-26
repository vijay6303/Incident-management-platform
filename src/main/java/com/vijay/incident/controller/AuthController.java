package com.vijay.incident.controller;

import com.vijay.incident.dto.AuthResponse;
import com.vijay.incident.dto.LoginRequest;
import com.vijay.incident.dto.RegisterRequest;
import com.vijay.incident.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        try {
            return authService.login(request);
        } catch (AuthenticationException ex) {
            throw new InvalidLoginException();
        }
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(InvalidLoginException.class)
    public String handleInvalidLogin(InvalidLoginException ex) {
        return "Invalid email or password";
    }

    private static class InvalidLoginException extends RuntimeException {
    }
}