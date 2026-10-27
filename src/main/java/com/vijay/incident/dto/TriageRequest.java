package com.vijay.incident.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TriageRequest(
        @NotBlank
        @Size(max = 140)
        String title,

        @NotBlank
        @Size(max = 3000)
        String description
) {
}