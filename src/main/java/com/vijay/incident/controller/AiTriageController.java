package com.vijay.incident.controller;

import com.vijay.incident.dto.TriageRequest;
import com.vijay.incident.dto.TriageResponse;
import com.vijay.incident.service.AiTriageService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiTriageController {

    private final AiTriageService aiTriageService;

    public AiTriageController(AiTriageService aiTriageService) {
        this.aiTriageService = aiTriageService;
    }

    @PostMapping("/triage")
    public TriageResponse triage(@Valid @RequestBody TriageRequest request) {
        return aiTriageService.triage(request);
    }
}