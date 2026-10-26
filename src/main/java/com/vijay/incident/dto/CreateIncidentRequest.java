package com.vijay.incident.dto;

import com.vijay.incident.entity.IncidentPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateIncidentRequest(
        @NotBlank @Size(max = 140) String title,
        @NotBlank @Size(max = 3000) String description,
        @NotNull IncidentPriority priority,
        @NotBlank @Email @Size(max = 120) String reporterEmail,
        @Email @Size(max = 120) String assigneeEmail
) {}
