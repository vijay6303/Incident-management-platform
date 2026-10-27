package com.vijay.incident.dto;

import com.vijay.incident.entity.IncidentPriority;
import java.util.List;

public record TriageResponse(
        String category,
        IncidentPriority suggestedPriority,
        String summary,
        List<String> suggestedActions
) {
}